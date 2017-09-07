// const process = require('child_process')
const process = require('process');
const child_process = require("child_process");
const crawler = require('crawler');
const fs = require('fs');
const moment = require('moment');

const winScriptPath = "./commit.bat";
const linuxScriptPath = "./commit.sh";


const crawlerUrl = "https://github.com/explore";
const queue = [crawlerUrl];

const getEnvScript = function() {
  var OS = "";
  var scriptPath = "";
  if(process.env.OS) {
    OS = 'win';
    scriptPath = winScriptPath;
  }else {
    OS = 'linux';
    scriptPath = linuxScriptPath;
  }
  return scriptPath;
}

const crawlerMeta = new crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    if (error) {
      export_to_text(error, "./error/" + moment().format("YYYY-MM-DDThh-mm-ss") + '.txt');
    } else {
      let $ = res.$;
      // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
      if (res.request.headers.referer == undefined) {
        var content = [];
        $('.d-md-flex').find('li').each((i, item) => {
          var $item = $(item);
          var name = $item.find('div').find('a').text();
          var desc = $item.find('div').find('p').text();
          content.push({
            "name": name,
            "desc": desc
          });
        });
        export_to_text(JSON.stringify(content), './file/' + moment().format("YYYY-MM-DDThh-mm-ss") + '.txt');
        execFile();
      }
    }
    done();
  }
})

const export_to_text = (data, filename) => {
  fs.writeFile(__dirname + '/' + filename, data, {flag: 'w'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log('写入成功');
      }
  });
}

const execFile = function() {
  child_process.execFile('commit.bat', null, { maxBuffer: 5000 * 1024 }, function (error,stdout,stderr) {
		if (error !== null) {
		  console.log('exec error: ' + error);
		}
	});
}

const entry = ( )=> {
  crawlerMeta.queue(queue);
}

entry();

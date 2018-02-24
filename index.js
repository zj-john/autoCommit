// const process = require('child_process')
const crawler = require('crawler');
const moment = require('moment');
const _utils = require('./utils');

const utils = new _utils();

const crawlerUrl = "https://github.com/explore";
const queue = [crawlerUrl];

const oldHandleFunction = (error, res, done) => {
  if (error) {
    utils.export_to_file(error, "./error/" + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
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
      utils.export_to_file(JSON.stringify(content), './file/' + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
      // 需要先进入到代码所在的目录，再进行git操作
      const cmd = 'cd /D '+ __dirname + ' && git add --all :/ && git commit -m "update" && git push origin master';
      utils.exec_cmd(cmd);
    }
  }
  done();
}

const newHandleFunction = (error, res, done) => {
  if (error) {
    utils.export_to_file(error, "./error/" + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
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
      utils.export_to_file(JSON.stringify(content), './file/' + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
      // 需要先进入到代码所在的目录，再进行git操作
      const cmd = 'cd /D '+ __dirname + ' && git add --all :/ && git commit -m "update" && git push origin master';
      utils.exec_cmd(cmd);
    }
  }
  done();
}

// 初始化crawler对象，赋默认属性
const crawlerMeta = new crawler({
  maxConnections: 1,
  // default handle function
  callback : function (error, res, done) {
      if(error){
          console.log(error);
      }else{
          var $ = res.$;
          console.log('Grabbed', res.body.length, 'bytes');
      }
      done();
  }
})

const entry = ( )=> {
  // crawlerMeta.queue(queue);
  crawlerMeta.queue([
    {
      uri: crawlerUrl,
      callback: oldHandleFunction
    }
  ]);
}

entry();

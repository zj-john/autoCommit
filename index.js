/*

爬虫主程序（未做os区分）

*/
const crawler = require('crawler');
const moment = require('moment');
const _utils = require('./utils');
const XLSX = require('xlsx');

const utils = new _utils();

// const crawlerUrl = "https://github.com/explore";
// const queue = [crawlerUrl];
// const oldHandleFunction = (error, res, done) => {
//   if (error) {
//     utils.export_to_file(error, "./error/" + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
//   } else {
//     let $ = res.$;
//     // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
//     if (res.request.headers.referer == undefined) {
//       var content = [];
//       $('.d-md-flex').find('li').each((i, item) => {
//         var $item = $(item);
//         var name = $item.find('div').find('a').text();
//         var desc = $item.find('div').find('p').text();
//         content.push({
//           "name": name,
//           "desc": desc
//         });
//       });
//       utils.export_to_file(JSON.stringify(content), './file/' + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
//       updateGit();
//     }
//   }
//   done();
// }

const crawlerUrl = "https://github.com/explore?trending=repositories#trending";
const newHandleFunction = (error, res, done) => {
  if (error) {
    utils.export_to_file(error, "./error/" + moment().format("YYYY-MM-DDTHH-mm-ss") + '.txt');
  } else {
    let $ = res.$;
    // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
    if (res.request.headers.referer == undefined) {
      // 获取页面数据
      var content = [];
      $('body').find('article.border-bottom').each((i, item) => {
        var $item = $(item);
        // console.log($item);
        var name = $item.children('div').first().find('h3').find('a').text();
        var desc = $item.children('p').text();
        var star = $item.children('p').next().children('a').first().text();
        var fork = $item.children('p').next().children('a').last().text();
        var language = $item.children('p').next().children('span').children('span').last().text();
        // console.log("content",name,desc,star,fork,language);
        content.push({
          "name": name.replace(/[\r\n]/g,"").replace(/(^\s*)|(\s*$)/g, ""),
          "desc": desc.replace(/[\r\n]/g,"").replace(/(^\s*)|(\s*$)/g, ""),
          "star": star.replace(/[\r\n]/g,"").replace(/(^\s*)|(\s*$)/g, ""),
          "fork": fork.replace(/[\r\n]/g,"").replace(/(^\s*)|(\s*$)/g, ""),
          "language": language.replace(/[\r\n]/g,"").replace(/(^\s*)|(\s*$)/g, ""),
          "time": moment().format("YYYY-MM-DDTHH-mm-ss")
        });
      });
      // 处理数据
      save_to_excel(content);
      updateGit();
    }
  }
  done();
}

const save_to_excel = (data) => {
  const workbook = XLSX.readFile('./file/git_explore.xlsx');
  const worksheet = workbook.Sheets["2018"];
  const old_data = XLSX.utils.sheet_to_json(worksheet);
  const _new_data = old_data.concat(data);
  const _headers = ["name","desc","language","star","fork","time"];
  //console.log(data);
  var headers = _headers
      .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
      // 转换成 worksheet 需要的结构
      // { A1: { v: 'id' },
      //   B1: { v: 'name' },
      //   C1: { v: 'age' },
      //   D1: { v: 'country' },
      //   E1: { v: 'remark' } }
      .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
  var data = _new_data
  // 匹配 headers 的位置，生成对应的单元格数据
  // [ [ { v: '1', position: 'A2' },
  //     { v: 'test1', position: 'B2' },
  //     { v: '30', position: 'C2' },
  //     { v: 'China', position: 'D2' },
  //     { v: 'hello', position: 'E2' } ],
  //   [ { v: '2', position: 'A3' },
  //     { v: 'test2', position: 'B3' },
  //     { v: '20', position: 'C3' },
  //     { v: 'America', position: 'D3' },
  //     { v: 'world', position: 'E3' } ],
  //   [ { v: '3', position: 'A4' },
  //     { v: 'test3', position: 'B4' },
  //     { v: '18', position: 'C4' },
  //     { v: 'Unkonw', position: 'D4' },
  //     { v: '???', position: 'E4' } ] ]
  .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
  // 对刚才的结果进行降维处理（二维数组变成一维数组）
  // [ { v: '1', position: 'A2' },
  //   { v: 'test1', position: 'B2' },
  //   { v: '30', position: 'C2' },
  //   { v: 'China', position: 'D2' },
  //   { v: 'hello', position: 'E2' },
  //   { v: '2', position: 'A3' },
  //   { v: 'test2', position: 'B3' },
  //   { v: '20', position: 'C3' },
  //   { v: 'America', position: 'D3' },
  //   { v: 'world', position: 'E3' },
  //   { v: '3', position: 'A4' },
  //   { v: 'test3', position: 'B4' },
  //   { v: '18', position: 'C4' },
  //   { v: 'Unkonw', position: 'D4' },
  //   { v: '???', position: 'E4' } ]
  .reduce((prev, next) => prev.concat(next))
  // 转换成 worksheet 需要的结构
  //   { A2: { v: '1' },
  //     B2: { v: 'test1' },
  //     C2: { v: '30' },
  //     D2: { v: 'China' },
  //     E2: { v: 'hello' },
  //     A3: { v: '2' },
  //     B3: { v: 'test2' },
  //     C3: { v: '20' },
  //     D3: { v: 'America' },
  //     E3: { v: 'world' },
  //     A4: { v: '3' },
  //     B4: { v: 'test3' },
  //     C4: { v: '18' },
  //     D4: { v: 'Unkonw' },
  //     E4: { v: '???' } }
  .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
  // 合并 headers 和 data
  var output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output);
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  // 构建 workbook 对象
  var wb = {
      SheetNames: ["2018"],
      Sheets: {
          "2018": Object.assign({}, output, { '!ref': ref })
      }
  };
  //console.log(wb);
  XLSX.writeFile(wb, './file/git_explore.xlsx');

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

const updateGit = () => {
  // 需要先进入到代码所在的目录，再进行git操作
  const cmd = 'cd /D '+ __dirname + ' && git add --all :/ && git commit -m "update" && git push origin master';
  utils.exec_cmd(cmd);
}

const entry = ()=> {
  // crawlerMeta.queue(queue);
  crawlerMeta.queue([
    {
      uri: crawlerUrl,
      callback: newHandleFunction
    }
  ]);
}

entry();

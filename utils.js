const process = require('process');
const child_process = require("child_process");
const fs = require('fs');

// 执行命令
const exec_cmd = function(cmd){
  child_process.exec(cmd, function(error, stdout, stderr) {
    if(error) {
        console.error('error: ' + error);
        return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  })
}

// 判断当前环境是 windows还是linux
// 不太确定此写法是否正确和完整，有不对的地方请指正，谢谢。
const get_env = function() {
  return process.env.OS? 'win': 'linux';
}


// 写入文件
const export_to_file = (data, filename) => {
  fs.writeFile(__dirname + '/' + filename, data, {flag: 'w'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log('写入成功');
      }
  });
}


function utils(){
  this.exec_cmd = exec_cmd;
  this.get_env = get_env;
  this.export_to_file = export_to_file;
}

module.exports = utils;

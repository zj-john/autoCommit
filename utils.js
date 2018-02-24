const process = require('process');
const child_process = require("child_process");
const fs = require('fs');
const os = require('os');
const XLSX = require('xlsx');

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
const get_env = function() {
  const os_platform= os.platform();
  let env;
  switch(os_platform) {
    case 'linux':
      env = 'linux';
      break;
    case 'win32':
      env = 'windows';
      break;
    case 'win64':
      env = 'windows';
      break;
    case 'darwin':
      env = 'linux';
      break;
    default:
      env = 'linux';
      break;
  }
  return env;
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

// 打开excel
const open_excel = (filename) => {
  const workbook = XLSX.readFile(filename);
  return workbook;
}

const read_excel = (worksheet) => {
  return XLSX.utils.sheet_to_json(worksheet)
}

const write_excel = (workbook, filename) => {
  XLSX.writeFile(workbook, filename);
}

function utils(){
  this.exec_cmd = exec_cmd;
  this.get_env = get_env;
  this.export_to_file = export_to_file;
  this.open_excel = open_excel;
  this.write_excel = write_excel;
  this.read_excel = read_excel;
}

module.exports = utils;

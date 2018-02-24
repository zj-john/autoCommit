// 生成计划任务
const _utils = require('./utils');
const utils = new _utils();
const env = utils.get_env();
const cmd = "";

if (env==='windows') {
  cmd = 'schtasks /create /tn "auto-commit" /tr "cmd /c node '+ __dirname + '\\index.js" /sc hourly /mo 8 /f';
} else if (env==='linux') {
  cmd = './' + __dirname + '/linux_crontab.sh'
}

utils.exec_cmd(cmd);

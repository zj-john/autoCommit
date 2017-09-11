const _utils = require('./utils');
const utils = new _utils();

const cmd = 'schtasks /create /tn "auto-commit" /tr "cmd /c node '+ __dirname + '\\index.js" /sc hourly /mo 8 /f';
utils.exec_cmd(cmd);

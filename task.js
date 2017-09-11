const utils = require('./utils');

const cmd = 'schtasks /create /tn "auto-commit" /tr "cmd /c node '+ __dirname + '\\index.js" /sc hourly /mo 8 /f';
utils.exec_cmd(cmd);
// const execCMD = function(){
//   child_process.exec('schtasks /create /tn "auto-commit" /tr "cmd /c node '+ __dirname + '\\index.js" /sc hourly /mo 8 /f', function(error, stdout, stderr) {
//     if(error) {
//         console.error('error: ' + error);
//         return;
//     }
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//   })
// }
//
// execCMD();

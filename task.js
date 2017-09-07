const child_process = require("child_process");

const execCMD = function(){
  child_process.exec('schtasks /create /tn "auto-commit" /tr "cmd /c node '+ __dirname + '\\index.js" /sc hourly /mo 8 /f', function(error, stdout, stderr) {
    if(error) {
        console.error('error: ' + error);
        return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  })
}

execCMD();

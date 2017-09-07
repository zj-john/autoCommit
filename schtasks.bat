schtasks /create /tn "auto-commit" /tr "cmd /c node index.js" /sc hourly /st 00:08:00

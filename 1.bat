schtasks /create /tn "auto-commit" /tr "cmd /c node E:\Code\GitHub\autoCommit\index.js" /sc hourly /mo 8

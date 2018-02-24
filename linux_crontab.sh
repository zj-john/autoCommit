#!/bin/sh
BASEDIR=`dirname $0`/..
BASEDIR=`(cd "$BASEDIR"; pwd)`
PROGRAM=$BASEDIR/index.js
# 每8h执行一次
CRONTAB_CMD="*/8 * * * * sh $PROGRAM once > /dev/null 2>&1 &"
COUNT=`crontab -l | grep $PROGRAM | grep -v "grep"|wc -l `
if [ $COUNT -lt 1 ]; then
  echo "fail to add crontab $PROGRAM"
  exit 1
fi
echo $CRONTAB_CMD >> /etc/crontab

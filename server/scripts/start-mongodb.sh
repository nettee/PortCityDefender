#/bin/bash

# start mongodb if it is not running
mongo_pid=`ps -e | grep "mongo"`
dbpath="$HOME/data/MongoDB"
date=`date "+%Y-%m-%d.%H:%M:%S"`

if [ -z "$mongo_pid" ]; then
    mongod --dbpath "$dbpath" --logpath "${dbpath}/log.${date}" &
    echo 'MongoDB server started'
else
    echo 'MongoDB server is already running'
fi

#/bin/bash

# start mongodb if it is not running
mongo_pid=`ps -e | grep "mongo"`
dbpath="../data/db"
date=`date "+%Y-%m-%d.%H:%M:%S"`

echo "dbpath={$dbpath}"

if [ ! -d "$dbpath" ]; then
    mkdir -p "$dbpath"
fi

if [ -z "$mongo_pid" ]; then
    mongod --dbpath "$dbpath" --logpath "${dbpath}/log.${date}" &
    echo 'MongoDB server started'
else
    echo 'MongoDB server is already running'
fi

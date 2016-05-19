#!/bin/bash

# deploy to remote server

USER=gcws
HOST=aliyun.nemoworks.info

LOCAL_SERVER_DIR=/home/dell/PortCityDefender
REMOTE_SERVER_DIR=/home/gcws/server

#scp -r $LOCAL_SERVER_DIR $USER@$HOST:$REMOTE_SERVER_DIR

# start server

ssh $USER@$HOST "cd server && npm start"

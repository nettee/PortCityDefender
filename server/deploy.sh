#!/bin/bash

# deploy to remote server

user=gcws
host=121.40.97.40

local_server_dir=`pwd`

# copy source files
ssh $user@$host "rm -rf ~/server/*"
scp -r src build package.json node_modules $user@$host:~/server

# start server
ssh $user@$host "cd ~/server && mkdir -p data/images && nohup npm restart > nohup.log.txt"

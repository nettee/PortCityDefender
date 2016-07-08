#!/bin/bash

# deploy to remote server

user=gcws
host=121.40.97.40

local_server_dir=`pwd`

# copy source files
ssh $user@$host "rm -rf ~/server/*"
scp -r src data build package.json node_modules $user@$host:~/server

# start server
ssh $user@$host "cd ~/server && nohup npm restart > nohup.log.txt"

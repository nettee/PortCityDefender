#!/bin/bash

# deploy to remote server

user=gcws
host=121.40.97.40

local_server_dir=`pwd`

# copy source files
ssh $user@$host "rm -rf ~/server"
scp -r $local_server_dir $user@$host:~

# start server
ssh $user@$host "cd ~/server && ./always-run.sh"

node_pid=`ps -o pid,cmd -C node --no-header | sed -e "s/^\s*\([0-9]\+\).*$/\1/"`
if [ -n "$node_pid" ]; # node_pid is not empty
then
    echo 'kill existing node process'
    kill -9 "$node_pid" 
fi


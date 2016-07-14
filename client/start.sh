#!/bin/sh

chrome=/usr/bin/google-chrome 
url="http://localhost:8100"

# start chrome browser
"$chrome" "$url" --disable-web-security --allow-file-access-from-files --user-data-dir=/tmp/ChromeData &

# start ionic debug
ionic serve -b -c

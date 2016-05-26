#!/bin/sh

CHROME=/usr/bin/google-chrome 
URL="http://localhost:8100"

$CHROME $URL --disable-web-security --allow-file-access-from-files --user-data-dir=/home/dell/ChromeData 

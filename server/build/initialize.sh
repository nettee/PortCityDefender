#!/bin/bash

./start-mongodb.sh
./import-data.sh

if [ ! -d "images" ]; then
    mkdir images
fi

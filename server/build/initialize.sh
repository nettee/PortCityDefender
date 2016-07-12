#!/bin/bash

./start-mongodb.sh
./import-data.sh

if [ ! -d "../data/images" ]; then
    mkdir ../data/images
fi

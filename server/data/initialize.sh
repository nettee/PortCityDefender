#!/bin/bash

./import-data.sh

if [ ! -d "images" ]; then
    mkdir images
fi

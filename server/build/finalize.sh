#!/bin/bash

echo `pwd`
image_dir="../data/images"
upload_dir="../data/uploads"

if [ -n "$(ls $image_dir)" ]; then
    rm --verbose $image_dir/*
fi

if [ -n "$(ls $upload_dir)" ]; then
    rm --verbose $upload_dir/*
fi

mongo remove-db-content.js
echo 'database content removed.'

#!/bin/bash

image_dir="../data/images"

if [ -n "$(ls $image_dir)" ]; then
    rm --verbose "$image_dir"
fi

mongo remove-db-content.js
echo 'database content removed.'

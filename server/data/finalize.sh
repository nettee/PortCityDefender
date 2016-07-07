#!/bin/bash

if [ -n "$(ls images)" ]; then
    rm --verbose images/*
fi

mongo remove-db-content.js
echo 'database content removed.'

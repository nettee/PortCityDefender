#!/bin/bash

data_dir="primer-dataset"

db="port_city_defender"

#collections=("users" "informations" "commands")
collections=("users")

for collection in ${collections[@]}; do
    mongoimport --db "$db" --collection "$collection" --drop --file "${data_dir}/${collection}.json"
done

data_dir="primer-dataset"
mongoimport --db port_city_defender --collection users --drop \
    --file "${data_dir}/users.json"

db = connect('localhost:27017/port_city_defender');

db.users.remove({});
db.informations.remove({});
db.images.remove({});
db.commands.remove({});
db.regions.remove({});

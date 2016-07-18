var express = require('express');

var commands = require('../models/commands');
var users = require('../models/users');

var router = express.Router();

function commandCreator(req, res, next) {
    var command = req.body;
    commands.create(command, function(err, result) {
        if (err) {
            return next(new Error(err));
        }
        users.readOne(command.receiver, function(err, receiver) {
            if (err) {
                return next(new Error(err));
            }
            users.readOne(command.sender, function(err, sender) {
                if (err) {
                    return next(new Error(err));
                }
                command.receiver = receiver;
                command.sender = sender;
                res.status(201).send(command);
            });
        });
    });
}

function commandListReader(req, res, next) {
    var query = req.query;
    if (query.receiver) {
        commands.readByReceiver(query.receiver, function (err, list) {
            if (err) {
                next(new Error(err));
            }
            res.status(200).send(list);
        });
    } else if (query.sender) {
        commands.readBySender(query.sender, function (err, list) {
            if (err) {
                next(new Error(err));
            }
            res.status(200).send(list);
        });
    } else {
        commands.read(function(err, list) {
            if (err) {
                next(new Error(err));
            }
            res.status(200).send(list);
        });
    }
}

// CREATE new command 
router.post('/', commandCreator);

// READ command list
router.get('/', commandListReader);


module.exports = router;

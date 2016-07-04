var express = require('express');

var commands = require('../models/commands');

var router = express.Router();

function commandCreator(req, res) {
    res.status(201).send({});
}

function commandListReader(req, res, next) {
    var condition = {};
    commands.read(condition, function(err, list) {
        if (err) {
            next(new Error(err));
        }
        res.status(200).send(list);
    });
}

// CREATE new command 
router.post('/', commandCreator);

// READ command list
router.get('/', commandListReader);


module.exports = router;

var express = require('express');
var assert = require('assert');

var informations = require('../models/informations');

var router = express.Router();

function infoCreator(req, res) {
    var info = req.body;
    console.log(info);
    informations.create(info, function(err, result) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.status(201).send(result);
        }
    });
}

function infoListReader(req, res) {
    var condition = {};
    informations.read(condition, function(err, list) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.status(200).send(list);
        }
    });
}

// CREATE new info 
router.post('/', infoCreator);

// READ info list
router.get('/', infoListReader);


module.exports = router;

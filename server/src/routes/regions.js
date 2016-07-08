var express = require('express');
var assert = require('assert');

var regions = require('../models/regions');

var router = express.Router();

function regionExistenceChecker(req, res, next) {
    var name = req.params.name;
    regions.contains(name, function (err, exists) {
        if (err) {
            res.status(500).send({error: err});
            return;
        }
        if (!exists) {
            res.status(404).send({error: 'region name does not exist'});
        }
        next();
    });
}

function regionListReader(req, res) {
    regions.read(function(err, list) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.status(200).send(list);
        }
    });
}

function regionCreator(req, res) {
    res.status(501).send({error: 'not implemented'});
//    var name = req.params.name;
//    regions.create(name, function(err, result) {
//        if (err) {
//            res.status(500).send({error: err});
//        } else {
//            res.status(201).send(result);
//        }
//    });
}

function regionDeleter(req, res) {
    res.status(501).send({error: 'not implemented'});
//    var name = req.params.name;
//    regions.delete(name, function(err) {
//        if (err) {
//            res.status(500).send({error: err});
//        } else {
//            res.status(204).send("");
//        }
//    });
}

// READ regions list
router.get('/', regionListReader);

// CREATE new region
router.post('/:name', regionCreator);

// DELETE region
router.delete('/:name', regionExistenceChecker, regionDeleter);

module.exports = router;

var express = require('express');
var assert = require('assert');

var regions = require('../models/regions');

var router = express.Router();

function regionExistenceChecker(req, res, next) {
    var name = req.params.name;
    regions.contains(name, function (err, exists) {
        if (err) {
            return next(new Error(err));
        }
        if (!exists) {
            res.status(404).send({error: 'region name does not exist'});
        }
        next();
    });
}

function regionListReader(req, res, next) {
    regions.read(function(err, list) {
        if (err) {
            return next(new Error(err));
        }
        res.status(200).send(list);
    });
}

function regionCreator(req, res, next) {
    var name = req.body.name;
    regions.create(name, function(err, result) {
        if (err) {
            return next(new Error(err));
        }
        res.status(201).send(result);
    });
}

function regionDeleter(req, res, next) {
   var name = req.params.name;
   regions.delete(name, function(err) {
       if (err) {
           return next(new Error(err));
       }
       res.status(204).send("");
   });
}

// READ regions list
router.get('/', regionListReader);

// CREATE new region
router.post('/', regionCreator);

// DELETE region
router.delete('/:name', regionExistenceChecker, regionDeleter);

module.exports = router;

var express = require('express');
var assert = require('assert');

var informations = require('../models/informations');

var router = express.Router();

function infoEssentialChecker(req, res, next) {
    var info = req.body;
    if (informations.hasEssentials(info)) {
        next();
    } else {
        var error = new Error('information object essentials missing');
        error.status = 422;
        next(error);
    }
}

function infoExistenceChecker(req, res, next) {
    var id = req.params.id;
    informations.existsId(id, function(err, exists) {
        if (err) {
            return next(new Error(err));
        }
        if (exists) {
            next();
        } else {
            var error = new Error('information id does not exist');
            error.status = 404;
            next(error);
        }
    });
}

function infoCreator(req, res, next) {
    var info = req.body;
    console.log(info);
    informations.create(info, function(err, result) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(201).send(result);
        }
    });
}

function infoListReader(req, res, next) {
    var condition = {};
    informations.read(condition, function(err, list) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(200).send(list);
        }
    });
}

function infoReader(req, res, next) {
    var id = req.params.id;
    informations.readOne(id, function(err, info) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(200).send(info);
        }
    });
}

function infoDeleter(req, res, next) {
    var id = req.params.id;
    informations.deleteById(id, function(err) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(204).send({});
        }
    });
}

// CREATE new info 
router.post('/', infoEssentialChecker, infoCreator);

// READ info list
router.get('/', infoListReader);

// READ info
router.get('/:id', infoExistenceChecker, infoReader);

// DELETE info
router.delete('/:id', infoExistenceChecker, infoDeleter);


module.exports = router;

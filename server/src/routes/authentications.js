var express = require('express');

var auth = require('./auth');
var authentications = require('../models/authentications');

var router = express.Router();

function authenticationCreator(req, res, next) {
    var authentication = req.body;
    authentications.create(authentication, function (err, result) {
        if (err) {
            return next(new Error(err));
        }
        res.status(201).send(result);
    })
}

function authenticationReader(req, res, next) {
    var username = req.params.username;
    authentications.readOne(username, function(err, authentication) {
        if (err) {
            return next(new Error(err));
        }
        res.status(200).send(authentication);
    });
}

function authenticationUpdater(req, res, next) {
    var username = req.params.username;
    var authentication = req.body;
    if (username !== authentication.username) {
        var error = new Error('inconsistent username between url and request body');
        error.status = 422;
        return next(error);
    }
    authentications.update(username, authentication, function (err, result) {
        if (err) {
            return next(new Error(err));
        }
        res.status(201).send(result);
    });
}

// CREATE authentication
router.post('/', auth.forAdmin, authenticationCreator);

// READ authentication
router.get('/:username', auth.forUsername, authenticationReader);

// UPDATE authentication
router.put('/:username', auth.forUsername, authenticationUpdater);

module.exports = router;

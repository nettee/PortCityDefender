var express = require('express');

var auth = require('./auth');
var authentications = require('../models/authentications');

var router = express.Router();

function authenticationReader(req, res) {
    var username = req.params.username;
    var condition = {'username': username};
    authentications.readOne(username, function(err, authentication) {
        if (err) {
            return next(new Error(err));
        }
        res.status(200).send(authentication);
    });
}

// READ user
router.get('/:username', auth.forUser, authenticationReader);

module.exports = router;

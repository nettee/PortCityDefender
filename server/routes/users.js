var express = require('express');
var assert = require('assert');

var users = require('../models/users');

var router = express.Router();

/**
 * check if user object has all six attributes
 *
 * used in: 
 *     PUT /users/_userid_
 */
function userCompletementChecker(req, res, next) {
    console.log('in userCompletementChecker');
    var user = req.body;
    if (!users.isCompleteUser(user)) {
        res.status(400).send({error: 'User information not complete'});
        res.end();
        return;
    }
    next();
}

/** check if user ID exists
 *
 * used in:
 *     GET /users/_userid_
 *     PUT /users/_userid_
 *     PATCH /users/_userid_
 */
function userExistenceChecker(req, res, next) {
    console.log('in userExistenceChecker');
    var id = req.params.id;
    users.existsId(id, function(err, exists) {
        if (err) {
            res.status(500).send({error: err});
            return;
        }
        if (!exists) {
            res.status(404).send({error: 'user ID does not exist'});
            return;
        }
        next();
    });
}

function userListReader(req, res) {
    var query = req.query;
    var condition = {};
    if (query.id) {
        condition.id = query.id;
    } 
    if (query.name) {
        condition.name = query.name;
    } 
    if (query.level) {
        condition.level = query.level;
    } 
    if (query.region) {
        condition.region = query.region;
    }
    users.read(condition, function(err, list) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(list);
        }
    });
}

function userReader(req, res) {
    var id = req.params.id;
    var condition = {'id': id};
    users.readOne(id, function(err, user) {
        if (err) {
            res.status(500).send({error: err});
            return;
        }
        res.status(200).send(user);
    });
}

function userCreator(req, res) {
    var user = req.body;
    users.create(user, function(err) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.status(201).send(user);
        }
    });
}

/**
 * update user information
 *
 * used by: 
 *     PUT /users/_userid_
 *     PATCH /users/_userid_
 */
function userUpdater(req, res) {
    var id = req.params.id;
    var user = req.body;
    if (user.id != id) {
        res.status(400).send({error: 'user ID is not consistent'});
        return;
    }
    users.update(id, user, function(err, result) {
        if (err) {
            res.status(500).send({error: err});
            return;
        }
        res.status(201).send(result);
    });
}

function userDeleter(req, res) {
    var id = req.params.id;
    users.deleteById(id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(204).send({});
        }
    });
}

// READ users list
router.get('/', userListReader);

// READ user
router.get('/:id', userExistenceChecker, userReader);

// CREATE new user
router.post('/', userCompletementChecker, userCreator);

// UPDATE user information
router.put('/:id', userCompletementChecker, userExistenceChecker, userUpdater);

// partly UPDATE user information
router.patch('/:id', userExistenceChecker, userUpdater);

// DELETE user
router.delete('/:id', userDeleter);

module.exports = router;

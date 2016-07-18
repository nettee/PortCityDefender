var express = require('express');

var auth = require('./auth');
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
        var error = new Error("user information not complete");
        error.status = 422;
        return next(error);
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
            return next(new Error(err));
        }
        if (!exists) {
            var error = new Error("user id already exists");
            error.status = 404;
            return next(error);
        }
        next();
    });
}

function userCreator(req, res, next) {
    var user = req.body;
    users.existsId(user.id, function(err, exists) {
        if (err) {
            return next(new Error(err));
        }
        if (exists) {
            var error = new Error("user id already exists");
            error.status = 409;
            return next(error);
        }
        users.create(user, function(err) {
            if (err) {
                return next(new Error(err));
            }
            res.status(201).send(user);
        });
    });

}

function userListReader(req, res, next) {
    var query = req.query;
    console.log('query =', query);
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
            return next(new Error(err));
        }
        res.status(200).send(list);
    });
}

function userReader(req, res, next) {
    var id = req.params.id;
    var condition = {'id': id};
    users.readOne(id, function(err, user) {
        if (err) {
            return next(new Error(err));
        }
        res.status(200).send(user);
    });
}

/**
 * update user information
 *
 * used by: 
 *     PUT /users/_userid_
 *     PATCH /users/_userid_
 */
function userUpdater(req, res, next) {
    var id = req.params.id;
    var user = req.body;
    if (user.id != id) {
        var error = new Error("user id not consistent");
        error.status = 422;
        return next(error);
    }
    users.update(id, user, function(err, result) {
        if (err) {
            return next(new Error(err));
        }
        res.status(201).send(result);
    });
}

function userDeleter(req, res, next) {
    var id = req.params.id;
    users.deleteById(id, function(err) {
        if (err) {
            return next(new Error(err));
        }
        res.status(204).send({});
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

// DELETE user
router.delete('/:id', userDeleter);

module.exports = router;

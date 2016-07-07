var express = require('express');
var util = require('util');
var router = express.Router();

var database = require('../models/database');
var users = require('../models/users');

function loginHandler(req, res, next) {
    res.render('login');
}

router.get('/', loginHandler);
router.get('/login', loginHandler);

router.post('/login.do', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username =', username, 'password =', password);
    if (username != "admin") {
        res.redirect('/login');
    }
    res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next) {
    res.redirect('/dashboard/users');
});

router.get('/dashboard/users', function(req, res, next) {
    users.read({}, function(err, users) {
        if (err) {
            return next(new Error(err));
        }
        res.render('dashboard_users', {users: users});
    });
});




router.get('/user/check-password', function (req, res, next) {
    var username = req.query.username;
    var password = req.query.password;
    console.log('username = %s, password = %s', username, password);
    users.checkPassword(username, password, function(result) {
        res.send(result);
    });
});

module.exports = router;

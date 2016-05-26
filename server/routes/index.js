var express = require('express');
var router = express.Router();

var database = require('../models/database');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login.do', function (req, res, next) {
    res.send(req.body);
    console.log('username = %s', req.body.username);
    console.log('password = %s', req.body.password);

    // FIXME
    res.redirect('/dashboard');
});

router.get('/dashboard', function (req, res, next) {
    res.send('Hello, Admin.');
});

router.get('/user/check-password', function (req, res, next) {
    var username = req.query.username;
    var password = req.query.password;
    console.log('username = %s, password = %s', username, password);
    database.checkPassword(username, password, function(result) {
        res.send(result);
    });
})

module.exports = router;

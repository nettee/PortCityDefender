var url = require('url');
var auth = require('basic-auth');

var fs = require('fs');
var express = require('express');
var router = express.Router();


/* This module deals with requests that
 * starts with /test
 */

/* test GET request */
router.get('/get', function (req, res, next) {
    res.send('GET success.');
});

/* test GET request with parameters */
router.get('/paramget', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    res.send(params);
})

/* test POST request */
router.post('/post', function (req, res, next) {
    res.send(req.body);
});

router.get('/auth', function (req, res, next) {
    console.log(req.get('Authorization'));
    res.send(auth(req));
});

module.exports = router;

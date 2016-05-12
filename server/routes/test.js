var url = require('url');

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

module.exports = router;

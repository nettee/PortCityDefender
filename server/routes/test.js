var url = require('url');
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

router.post('/image', function(req, res) {
    req.on('data', function(chunk) {
        console.log('on data');
        console.log(chunk);
        res.writeHead('200', {'Content-Type': 'image/png'});
        res.write(chunk);
        res.end();
    });

    req.on('end', function() {
        console.log('on end');
    });
});

router.get('/cat', function(req, res) {
    var options = {encoding: 'utf8', flag: 'r'};
    var fileReadStream = fs.createReadStream('/private/text/a.txt', options);
    res.end();
});

module.exports = router;

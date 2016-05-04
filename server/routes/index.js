var url = require('url');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* test GET request */
router.get('/test/get', function(req, res, next) {
   res.send('GET success.');
});

/* test GET request with parameters */
router.get('/test/paramget', function(req, res, next) {
    var params = url.parse(req.url, true).query;
    res.send(params);
})

/* test POST request */
router.post('/test/post', function(req, res, next) {
    res.send(req.body);
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login.do', function(req, res, next) {
    res.send(req.body);
    console.log('username = %s', req.body.username);
    console.log('password = %s', req.body.password);

    // FIXME
    res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next) {
    res.send('Hello, Admin.');
});

module.exports = router;

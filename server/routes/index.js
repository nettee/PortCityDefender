var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login.do', function(req, res, next) {
    res.send(req.body);
    console.log('username = %s', req.body.username);
    console.log('password = %s', req.body.password);
});

module.exports = router;

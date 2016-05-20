var express = require('express');
var router = express.Router();

// GET users list
router.get('/', function (req, res, next) {
    var query = req.query;
    if (query.id) {
        res.send('get user by id.');
    } else if (query.name) {
        res.send('get user by name.');
    } else if (query.level) {
        res.send('get user by level.');
    } else {
        res.send('It seems that you are trying to get users list.');
    }
});

// POST new user
router.post('/', function(req, res) {
    res.send(req.body);
});

module.exports = router;

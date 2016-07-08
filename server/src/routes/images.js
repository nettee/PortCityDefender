var express = require('express');
var fs = require('fs');
var util = require('util');

var mime = require('mime');

var images = require('../models/images');

var router = express.Router();

function imageReader(req, res, next) {
    var id = req.params.id;
    images.readOne(id, function(err, image) {
        if (err) {
            return next(new Error(err));
        }
        if (!image) {
            var error = new Error('image id does not exist');
            error.status = 404;
            return next(error);
        }
        var filename = util.format('%s.%s', image.id, mime.extension(image.mime_type));

        var options = {
            root: images.image_dir,
        };
        res.sendFile(filename, options, function(err) {
            if (err) {
                next(new Error(err));
            }
        });
            
    });
}

router.get('/:id', imageReader);

module.exports = router;

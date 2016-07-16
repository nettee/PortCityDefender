var express = require('express');
var fs = require('fs');
var util = require('util');

var mime = require('mime');

var multer = require('multer');
var upload = multer({ dest: '../data/uploads/'});

var images = require('../models/images');

var router = express.Router();

function imageCreator(req, res, next) {

    console.log(req.file);
    console.log(req.file.path);

    images.create({
        size: req.file.size,
        mime_type: req.file.mimetype
    }, function (err, image, image_id) {

        if (err) {
            return next(new Error(err));
        }

        console.log('image =', image);

        var from_path = req.file.path;
        var extension = req.file.originalname.split('.')[1];
        var target_path = util.format('%s/%s.%s', images.image_dir, image.id, extension);
        console.log('move from %s to %s', from_path, target_path);

        var src = fs.createReadStream(from_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() {
            res.status(201).send(image);
        });
        src.on('error', function(err) {
            next(new Error(err));
        });
    });
}

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
router.post('/', upload.single('file-data'), imageCreator);

router.get('/:id', imageReader);

module.exports = router;

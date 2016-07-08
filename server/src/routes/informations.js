var express = require('express');
var assert = require('assert');
var fs = require('fs');
var util = require('util');

var mime = require('mime');

var informations = require('../models/informations');
var images = require('../models/images');

var router = express.Router();

function infoEssentialChecker(req, res, next) {
    var info = req.body;
    if (informations.hasEssentials(info)) {
        next();
    } else {
        var error = new Error('information object essentials missing');
        error.status = 422;
        next(error);
    }
}

function infoExistenceChecker(req, res, next) {
    var id = req.params.id;
    informations.existsId(id, function(err, exists) {
        if (err) {
            return next(new Error(err));
        }
        if (exists) {
            next();
        } else {
            var error = new Error('information id does not exist');
            error.status = 404;
            next(error);
        }
    });
}

function infoCreator(req, res, next) {
    var info = req.body;
    informations.create(info, function(err, result) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(201).send(result);
        }
    });
}

function infoListReader(req, res, next) {
    var condition = {};
    informations.read(condition, function(err, list) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(200).send(list);
        }
    });
}

function infoReader(req, res, next) {
    var id = req.params.id;
    informations.readOne(id, function(err, info) {
        if (err) {
            next(new Error(err));
        } else {
            // FIXME check info == null, return 404
            res.status(200).send(info);
        }
    });
}

function infoDeleter(req, res, next) {
    var id = req.params.id;
    informations.deleteById(id, function(err) {
        if (err) {
            next(new Error(err));
        } else {
            res.status(204).send({});
        }
    });
}

function infoImageCreator(req, res, next) {
    if (!req.is('image/*')) {
        var error = new Error('Content-Type should be image/*');
        error.status = 406;
        return next(error);
    }

    var id = req.params.id;
    var size = req.get('Content-Length');
    var mime_type = req.get('Content-Type');

    var extension = mime.extension(mime_type);
    if (!extension) {
        var error = new Error(util.format('Invalid MIME type %s', mime_type));
        error.status = 406;
        return next(error);
    }

    images.create(id, {size: size, mime_type: mime_type}, function(err, image, image_id) {
        console.log('image_id =', image_id);
        if (err) {
            return next(new Error(err));
        }
        var filepath = util.format('%s/%s.%s', images.image_dir, image.id, extension);
        var out_file = fs.createWriteStream(filepath);
        req.pipe(out_file);
        console.log('write file to', filepath);
        console.log('dirname =', __dirname);
        informations.addImageById(id, image_id, function(err) {
            if (err) {
                return next(new Error(err));
            }
            res.status(201).send(image);
        });
    });
}

// CREATE new info 
router.post('/', infoEssentialChecker, infoCreator);

// READ info list
router.get('/', infoListReader);

// READ info
router.get('/:id', infoExistenceChecker, infoReader);

// DELETE info
router.delete('/:id', infoExistenceChecker, infoDeleter);

// CREATE info image
router.post('/:id/images', infoImageCreator);


module.exports = router;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var test_routes = require('./routes/test');
var users_routes = require('./routes/users');
var regions_routes = require('./routes/regions');
var informations_routes = require('./routes/informations');
var commands_routes = require('./routes/commands');
var document_routes = require('./routes/documents');
var images_routes = require('./routes/images');
var authentications_routes = require('./routes/authentications');

var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log('====================================================');
    console.log('Request:');
    console.log(req.method, req.originalUrl);
    console.log(req.body);
    console.log('----------------------------------------------------');
    next();
});

// routes, see routes/*.js

app.use('/', session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'love'
}), function (req, res, next) {
    console.log('req.session = ', req.session);
    if (req.session.user || /^\/login/.test(req.url)) {
        console.log('next');
        next();
    } else {
        res.redirect('/login');
        console.log('redirect');
    }
}, routes);

// app.use(auth.forAllUsers);

app.use('/test', test_routes);
app.use('/authentications', authentications_routes);
app.use('/users', users_routes);
app.use('/regions', regions_routes);
app.use('/information', informations_routes);
app.use('/commands', commands_routes);
app.use('/documents', document_routes);
app.use('/images', images_routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send({
        status: 404,
        message: req.url + ' Not Found'
    });
});

// error handlers

/* development error handler, will print stacktrace
 *
 * this error handler can be triggered by `next(error)`,
 * where error is an `Error` object created by `new Error(message)`
 *
 * Example:
 *
 * function do_get(req, res, next) {
 *   if (something_wrong) {
 *     var error = new Error('some message');
 *     error.status = 503;
 *   } else {
 *     do_something();
 *   }
 *
 */

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('caused development error handler');
        if (err.status != 404) {
            console.log(err.message);
            console.log(err.stack);
        }
        var status = err.status || 500;
        res.status(status);
        res.send({
            status: status,
            message: err.message,
            stack: err.stack,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('caused production error handler');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

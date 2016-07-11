var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basic_auth = require('basic-auth');

var routes = require('./routes/index');
var test_routes = require('./routes/test');
var users_routes = require('./routes/users');
var regions_routes = require('./routes/regions');
var informations_routes = require('./routes/informations');
var commands_routes = require('./routes/commands');
var images_routes = require('./routes/images');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

app.use(function(req, res, next) {
    var auth = basic_auth(req);
    if (!auth) {
        res.status(401).send({
            status: 401,
            message: 'No Authorization information'
        });
        return;
    }
    if (auth.name !== auth.pass) {
        res.status(401).send({
            status: 401,
            message: 'Authorization failed'
        });
        return;
    }
    next();
});

// routes, see routes/*.js
app.use('/', routes);
app.use('/test', test_routes);
app.use('/users', users_routes);
app.use('/regions', regions_routes);
app.use('/information', informations_routes);
app.use('/commands', commands_routes);
app.use('/images', images_routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

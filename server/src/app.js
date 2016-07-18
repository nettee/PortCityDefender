var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var Session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// create session middleware
var session = Session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'love' // ???
});

var dashboard_routes = require('./routes/dashboard');
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

/* Automatically parse json object in request, and store the parsing
 * result in `req.body`. If request is not json type (i.e., "Content-Type"
 * is not "application/json", it won't be parsed.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// for logging
// Each time a request reaches, log the verb, url, body of request.
app.use(function(req, res, next) {
    console.log('====================================================');
    console.log('Request:');
    console.log(req.method, req.originalUrl);
    console.log(req.body);
    console.log('----------------------------------------------------');
    next();
});

/*
 * Session control:
 *
 * Session only applies for /login, /login.do, /logout, and url starting with
 * /dashboard.
 *
 * 1. Add `session` middleware for these routes, which can automatically set
 * session information in `req.session`
 * 2. When a user log in through /login.do, store login information in session,
 * specifically, `req.session.user`
 * 3. Every time a request ask for /dashboard/*, check whether `req.session.user`
 * is set. If `req.session.user` is undefined, redirect to login page.
 * 4. When logging out, delete `req.session.user`.
 *
 */
app.get('/login', session, function(req, res, next) {
    res.render('login');
});

app.post('/login.do', session, function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username =', username, 'password =', password);
    if (username == "admin" && password == "admin") {
        // store login information in session
        req.session.user = {
            username: 'admin',
            password: 'admin'
        };
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', session, function(req, res, next) {
    // delete login information in session
    req.session.user = null;
    res.redirect('/login');
});

// routes, see routes/*.js

app.use('/dashboard', session, function (req, res, next) {
    /*
     * If `req.session.user` exists, it means that user is already logged in.
     * Otherwise, we should redirect to login page.
     */
    console.log('req.session = ', req.session);
    if (req.session.user || /^\/login/.test(req.url)) {
        console.log('next');
        next();
    } else {
        res.redirect('/login');
        console.log('redirect');
    }
}, dashboard_routes);

// routes for RESTful APIs
app.use('/test', auth.forAllUsers, test_routes);
app.use('/authentications', auth.forAllUsers, authentications_routes);
app.use('/users', auth.forAllUsers, users_routes);
app.use('/regions', auth.forAllUsers, regions_routes);
app.use('/information', auth.forAllUsers, informations_routes);
app.use('/commands', auth.forAllUsers, commands_routes);
app.use('/documents', auth.forAllUsers, document_routes);
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

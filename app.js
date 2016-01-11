var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var info = require('./routes/info');
var login = require('./routes/login/login');
var register = require('./routes/login/register');
var session = require('express-session');
var messages  = require('./lib/message.js');
var page  = require('./lib/page.js');
var user_menu  = require('./lib/user_menu.js');
var checkMiddle  = require('./lib/checkMiddle.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
////session无法保存值问题:将secure改为false
///推荐选项是将sercure属性的值设为true（即secure: true）
///。然而，它需要网站是https-enabled,也就是说HTTPS这货对于secure cookies是必须的。
//// If secure is set, and you access your site over HTTP, the cookie will not be set.
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
////自定义的中间件
app.use(messages);
app.use(user_menu);
////访问路径
app.use('/users', users);
app.get('/login', login);
app.get('/loginout', login);
app.get('/register', register);
app.get('/saveInfo', info);
app.get('/showInfo', page(5), info);
app.post('/saveInfo', checkMiddle.notSpace("titie"), checkMiddle.notSpace("meanValue"), info);
app.post('/showInfo', checkMiddle.notSpace("from"), checkMiddle.notSpace("to"),page(5), info);
app.post('/loginIn', login);
app.post('/register', register);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

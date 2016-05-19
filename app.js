var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var genre = require('./routes/genre_route');
var state = require('./routes/state_route');
var game = require('./routes/game_route');
var player = require('./routes/player_route');
var auth_required = require('./routes/auth_required');
var auth_not_required = require('./routes/auth_not_required');

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
app.use(session({secret: 'Project02'}));

app.use('/', routes);
app.use('/users', users);
app.use('/genre', genre);
app.use('/state', state);
app.use('/game', game);
app.use('/player', player);

function restrict(req, res, next){
  if(req.session.account) { //check if user is authenticated yet
    next();  //user logged in so proceed to requested page
  }
  else {
    req.session.originalUrl = req.originalUrl;
    res.redirect('/login');  // they aren't so ask them to login
  }
}
app.use('/auth_required', restrict, auth_required); //password protected
app.use('/auth_not_required', auth_not_required); //not password protected


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

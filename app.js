'use strict';

// Setup dependencies
var express = require('express'),
  mongoose = require('mongoose'),
  helmet = require('helmet'),
  nunjucks = require('nunjucks'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),
  path = require('path'),
  flash = require('connect-flash'),
  User = require('./models/user'),
  morgan = require('morgan');

// Check for environment variables
require('./helpers/env-vars')();

// Determine production or local database is to be used
var connectionURL =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/tungsten';
if (process.env.DATABASE_URL) {
  console.log('Connecting to an environment variable defined database.');
} else {
  console.log('Connecting to a localhost database.');
}

// Configure mongoose and connect to database, per mongoose documentation,
// connection options will prevent deprecation warnings
mongoose.Promise = global.Promise;
mongoose.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

// Initialize express, serve static files
var app = express();

// Log messages from the server
app.use(morgan('[:date[iso]] :method :url from :remote-addr'));

// Make the app more secure with helmetjs
app.use(helmet());

// Built-in middleware, serve static files from 'public' folder
app.use(express.static(__dirname + '/public'));

// Configure session ID
var sessionSecret = process.env.SESSION_SECRET || 'not so secret';
if (process.env.SESSION_SECRET) {
  console.log('Session secret defined by environment variable.');
} else {
  console.log('Using default session secret.');
}

// User session stored on client side with cookies
app.use(
  require('cookie-session')({
    name: 'session',
    keys: [sessionSecret],
    maxAge: 1000 * 60 * 60, // expires after one hour
  })
);
// Session expiration is updated by the minute
app.use(function(req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

// Configure local passport strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure miscellaneous packages
nunjucks.configure('./views', {
  autoescape: true,
  express: app,
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(flash());

// App-level middleware, allow req.user and flash messages to be
// visible in all routes
app.use(function(req, res, next) {
  var user;
  if (req.user) {
    user = req.user.username;
    req.user.name = user.slice(0, user.indexOf('@'));
  }
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
var indexRoutes = require('./routes/index'),
  jsonRoutes = require('./routes/json'),
  participantRoutes = require('./routes/participants'),
  worksheetRoutes = require('./routes/worksheets'),
  userRoutes = require('./routes/users'),
  ajaxRoutes = require('./routes/ajax');
app.use(indexRoutes);
app.use('/json', jsonRoutes);
app.use('/participants', participantRoutes);
app.use('/worksheets', worksheetRoutes);
app.use('/users', userRoutes);
app.use('/ajax', ajaxRoutes);

// Start server
var server = app.listen(process.env.PORT || 3000, function() {
  var activePort = server.address().port,
    startDate = new Date().toISOString();
  console.log(
    '[%s] Tungsten server is listening on port %s',
    startDate,
    activePort
  );
});

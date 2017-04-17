/*jslint node: true */
/*jslint nomen: true */
"use strict";

// Setup dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    nunjucks = require('nunjucks'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    assert = require('assert'),
    Participant = require('./models/participant'),
    Worksheet = require('./models/worksheet'),
    User = require('./models/user');

var app = express();
app.use(express.static(__dirname + '/public'));

// Prepare database
var connectionURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/tungsten';
mongoose.Promise = global.Promise;
mongoose.connect(connectionURL);

// Configure Passport
app.use(require("express-session")({
    secret: "the summer of george",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure middleware
nunjucks.configure('./views', {
    autoescape: true,
    express: app
});
app.use(bodyParser.urlencoded({
    extended: true
}));

// Wellness app routing
var indexRoutes = require('./routes/index'),
    participantRoutes = require('./routes/participants'),
    worksheetRoutes = require('./routes/worksheets');
app.use(indexRoutes);
app.use("/participants", participantRoutes);
app.use("/worksheets", worksheetRoutes);

// Start server
var server = app.listen(process.env.PORT || 3000, function () {
    var activePort = server.address().port,
        startDate = new Date().toLocaleString();
    console.log('[%s] Tungsten server is listening on port %s', startDate, activePort);
});
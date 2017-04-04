/*jslint node: true */
"use strict";

var express = require('express'),
    mongoose = require('mongoose'),
    nunjucks = require('nunjucks'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    Participant = require('./models/participant'),
    Assessment = require('./models/assessment'),
    Worksheet = require('./models/worksheet'),
    User = require('./models/user'),
    seedDb = require('./testing/seeds');

var app = express();

var connectionURL = process.env.DATABASE_URL || 'mongodb://localhost/tungsten';
mongoose.connect(connectionURL);

// Seed database for testing
seedDb();

nunjucks.configure('./views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/wellness/worksheet', function (req, res) {
    res.render('worksheet.njk');
});

// Start server
var server = app.listen(process.env.PORT || 3000, function () {
    var activePort = server.address().port,
        startDate = new Date().toLocaleString();
    console.log('[%s] Tungsten server is listening on port %s', startDate, activePort);
});
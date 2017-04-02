/*jslint node: true */
"use strict";

var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    bodyParser = require('body-parser');

app.engine('njk', cons.nunjucks);
app.set('view engine', 'njk');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/worksheet', function (req, res) {
    res.render('worksheet');
});

// TODO update for heroku and local testing
app.listen(3000, function () {
    console.log('Tungsten listening on port 3000!');
});

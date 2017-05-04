/*jslint node: true*/
'use strict';

var express = require("express"),
    router = express.Router();

// index route
router.get('/', function (req, res) {
    res.render('landing.njk');
});

// login route
router.get('/login', function (req, res) {
    res.render('login.njk');
});

// password recovery
router.get('/password-recovery', function (req, res) {
    res.send("password recovery page not yet implemented!");
});

module.exports = router;
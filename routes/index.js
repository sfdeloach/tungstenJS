/*jslint node: true*/
'use strict';

var express = require("express"),
    router = express.Router();

// index route
router.get('/', function (req, res) {
    res.render('landing.njk');
});

module.exports = router;
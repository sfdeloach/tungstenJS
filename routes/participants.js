/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    Participant = require('../models/participant'),
    User = require('../models/user'),
    Worksheet = require('../models/worksheet');

// index route
router.get('/', function (req, res) {
    Participant.find({}, function (err, foundParticipants) {
        res.send("You have hit the participants index page.");
    });
});

module.exports = router;
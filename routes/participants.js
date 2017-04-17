/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    Participant = require('../models/participant'),
    Worksheet = require('../models/worksheet'),
    User = require('../models/user');

// index route - json response
router.get('/json', function (req, res) {
    Participant.find({}, function (err, foundParticipants) {
        res.send(foundParticipants);
    });
});

module.exports = router;
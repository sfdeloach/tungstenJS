/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    dateHelper = require('../helpers/kram-datetime'),
    Participant = require('../models/participant'),
    User = require('../models/user'),
    Worksheet = require('../models/worksheet');

// participant index
router.get('/', function (req, res) {
    var totalParticipants = 0;
    Participant.count({}, function (err, count) {
        if (err) {
            console.log(err);
        }
        Participant.find({}, function (err, foundParticipants) {
            if (err) {
                console.log(err);
            } else if (count === 0) {
                res.render('participants/index.njk', {
                    participants: foundParticipants
                });
            } else {
                foundParticipants.forEach(function (participant) {
                    participant.pretty_dob = new Date(participant.dob).toLocaleDateString();
                    totalParticipants += 1;
                    if (totalParticipants === count) {
                        res.render('participants/index.njk', {
                            participants: foundParticipants
                        });
                    }
                });
            }
        });
    });
});

// new participant form
router.get('/new', function (req, res) {
    res.render('participants/new.njk');
});

// create new participant
router.post('/', function (req, res) {
    var newParticipant = req.body.participant;
    newParticipant.dob = dateHelper.htmlToDb(newParticipant.dob);
    Participant.create(newParticipant, function (err, createdParticipant) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/participants');
        }
    });
});

// edit participant
router.get('/:id/edit', function (req, res) {
    var id = req.params.id;
    Participant.findById(id, function (err, foundParticipant) {
        if (err) {
            console.log(err);
            res.redirect('/participants');
        } else {
            if (foundParticipant) {
                if (foundParticipant.dob) {
                    foundParticipant.htmlDOB = dateHelper.dbToHtml(foundParticipant.dob);
                }
                res.render('participants/edit.njk', {
                    participant: foundParticipant
                });
            } else {
                res.redirect('/participants');
            }
        }
    });
});

// update participant
router.put('/:id', function (req, res) {
    var id = req.params.id,
        updatedParticipant = req.body.participant;
    updatedParticipant.dob = dateHelper.htmlToDb(updatedParticipant.dob);
    Participant.findByIdAndUpdate(id, updatedParticipant, function (err, updatedParticipant) {
        if (err) {
            res.redirect("/participants");
        } else {
            res.redirect("/participants");
        }
    });
});

// destroy participant
router.delete('/:id', function (req, res) {
    Participant.findByIdAndRemove(req.params.id, function (err) {
        res.redirect("/participants");
    });
});

module.exports = router;
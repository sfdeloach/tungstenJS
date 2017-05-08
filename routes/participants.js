/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    dateHelper = require('../helpers/myDatetime'),
    Participant = require('../models/participant'),
    User = require('../models/user'),
    Worksheet = require('../models/worksheet'),
    authorization = require('../helpers/authorization.js');

// participant index
router.get('/', authorization.isEditor, function (req, res) {
    var totalParticipants = 0;
    Participant.count({}, function (err, count) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/');
        }
        Participant.find({}, function (err, foundParticipants) {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/');
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
router.get('/new', authorization.isEditor, function (req, res) {
    res.render('participants/new.njk');
});

// create new participant
router.post('/', authorization.isEditor, function (req, res) {
    var newParticipant = req.body.participant;
    newParticipant.dob = dateHelper.htmlToDb(newParticipant.dob);
    Participant.create(newParticipant, function (err, createdParticipant) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/participants');
        } else {
            req.flash("success", "A new participant was successfully created.");
            res.redirect('/participants');
        }
    });
});

// edit participant
router.get('/:id/edit', authorization.isEditor, function (req, res) {
    var id = req.params.id;
    Participant.findById(id, function (err, foundParticipant) {
        if (err) {
            req.flash("error", err.message);
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
                req.flash("error", "Participant was not found.");
                res.redirect('/participants');
            }
        }
    });
});

// update participant
router.put('/:id', authorization.isEditor, function (req, res) {
    var id = req.params.id,
        updatedParticipant = req.body.participant;
    updatedParticipant.dob = dateHelper.htmlToDb(updatedParticipant.dob);
    Participant.findByIdAndUpdate(id, updatedParticipant, function (err, updatedParticipant) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/participants');
        } else {
            req.flash("success", "Participant was successfully updated.");
            res.redirect('/participants');
        }
    });
});

// destroy participant
router['delete']('/:id', authorization.isEditor, function (req, res) {
    Participant.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/participants');
        } else {
            req.flash("success", "Participant was successfully deleted.");
            res.redirect("/participants");
        }
    });
});

module.exports = router;
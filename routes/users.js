/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// participant index
router.get('/', function (req, res) {
    var totalUsers = 0;
    User.count({}, function (err, count) {
        if (err) {
            console.log(err);
        }
        User.find({}, function (err, foundUsers) {
            if (err) {
                console.log(err);
            } else if (count === 0) {
                res.render('users/index.njk', {
                    users: foundUsers
                });
            } else {
                foundUsers.forEach(function (user) {
                    totalUsers += 1;
                    if (totalUsers === count) {
                        res.render('users/index.njk', {
                            users: foundUsers
                        });
                    }
                });
            }
        });
    });
});

// new user form
router.get('/new', function (req, res) {
    res.render('users/new.njk');
});

// create new participant
router.post('/', function (req, res) {
    var newUser = new User({
        username: req.body.username,
        needs_reset: false,
        auth_level: req.body.auth_level
    });
    console.log(newUser);
    User.register(newUser, req.body.password, function (err, createdUser) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/users');
            });
        }
    });
});

//// edit participant
//router.get('/:id/edit', function (req, res) {
//    var id = req.params.id;
//    Participant.findById(id, function (err, foundParticipant) {
//        if (err) {
//            console.log(err);
//            res.redirect('/participants');
//        } else {
//            if (foundParticipant) {
//                if (foundParticipant.dob) {
//                    foundParticipant.htmlDOB = dateHelper.dbToHtml(foundParticipant.dob);
//                }
//                res.render('participants/edit.njk', {
//                    participant: foundParticipant
//                });
//            } else {
//                res.redirect('/participants');
//            }
//        }
//    });
//});
//
//// update participant
//router.put('/:id', function (req, res) {
//    var id = req.params.id,
//        updatedParticipant = req.body.participant;
//    updatedParticipant.dob = dateHelper.htmlToDb(updatedParticipant.dob);
//    Participant.findByIdAndUpdate(id, updatedParticipant, function (err, updatedParticipant) {
//        if (err) {
//            res.redirect("/participants");
//        } else {
//            res.redirect("/participants");
//        }
//    });
//});
//
//// destroy participant
//router['delete']('/:id', function (req, res) {
//    Participant.findByIdAndRemove(req.params.id, function (err) {
//        res.redirect("/participants");
//    });
//});

module.exports = router;
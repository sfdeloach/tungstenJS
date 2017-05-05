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

// edit participant
router.get('/:id/edit', function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect('/users');
        } else {
            if (foundUser) {
                res.render('users/edit.njk', {
                    user: foundUser
                });
            } else {
                res.redirect('/users');
            }
        }
    });
});

// password reset route
router.get('/:id/password-reset', function (req, res) {
    res.send("you have hit the password reset route");
});

// update user
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: { auth_level: req.body.auth_level }}, function (err, updatedUser) {
        if (err) {
            console.log(err);
            res.redirect("/users");
        } else {
            res.redirect("/users");
        }
    });
});

// destroy user
router['delete']('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        res.redirect("/users");
    });
});

module.exports = router;
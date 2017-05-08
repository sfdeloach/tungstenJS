/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    authorization = require('../helpers/authorization.js');

// user index
router.get('/', authorization.isAdmin, function (req, res) {
    var totalUsers = 0;
    User.count({}, function (err, count) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/');
        }
        User.find({}, function (err, foundUsers) {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/');
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
router.get('/new', authorization.isAdmin, function (req, res) {
    res.render('users/new.njk');
});

// create new user
router.post('/', authorization.isAdmin, function (req, res) {
    var newUser = new User({
        username: req.body.username,
        needs_reset: false,
        auth_level: req.body.auth_level
    });
    User.register(newUser, req.body.password, function (err, newUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/users/new');
        } else {
            req.flash("success", "A new user was successfully created.");
            res.redirect('/users');
        }
    });
});

// edit user
router.get('/:id/edit', authorization.isAdmin, function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/users');
        } else {
            if (foundUser) {
                res.render('users/edit.njk', {
                    foundUser: foundUser
                });
            } else {
                req.flash("error", "The requested user was not located.");
                res.redirect('/users');
            }
        }
    });
});

// update user
router.put('/:id', authorization.isAdmin, function (req, res) {
    User.findByIdAndUpdate(req.params.id, {
        $set: { auth_level: req.body.auth_level,
                needs_reset: req.body.needs_reset }
    }, function (err, updatedUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/users');
        } else {
            req.flash("success", "A user was successfully updated.");
            res.redirect("/users");
        }
    });
});

// destroy user
router['delete']('/:id', authorization.isAdmin, function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/users');
        } else {
            req.flash("success", "A user was successfully deleted.");
            res.redirect("/users");
        }
    });
});

module.exports = router;
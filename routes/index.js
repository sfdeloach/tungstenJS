/*jslint node: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    authorization = require('../helpers/authorization.js');

// index route
router.get('/', authorization.isViewer, function (req, res) {
    res.render('landing.njk');
});

// login route
router.get('/login', function (req, res) {
    res.render('login.njk');
});

// login logic goes here
router.post('/login', passport.authenticate("local", {
    successRedirect: '/passwordResetCheck',
    failureRedirect: '/login'
}));

// check for password reset
router.get('/passwordResetCheck', authorization.isViewer, function (req, res) {
    if (req.user.needs_reset) {
        res.redirect('/passwordReset');
    } else {
        res.redirect('/');
    }
});

// password reset
router.get('/passwordReset', authorization.isViewer, function (req, res) {
    res.render('passwordReset.njk');
});

// password reset put request
router.put('/passwordReset', authorization.isViewer, function (req, res) {
    User.findById(req.user._id, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            foundUser.setPassword(req.body.password, function () {
                foundUser.needs_reset = false;
                foundUser.save();
                res.redirect('/');
            });
        }
    });
});

// password recovery - no authorization intentionally
router.get('/recovery', function (req, res) {
    res.render('recovery.njk');
});

// send password recovery email - no authorization intentionally
router.post('/recovery', function (req, res) {
    var username = req.body.username;
    // check that the email account exists
    // create a random password string
    // set the account with the new random password string
    // set the account for needs_reset = true
    // send email w/ instructions
    res.send("password recovery email sent...not really, this feature is not yet implemented");
});

// logout route
router.get('/logout', function (req, res) {
    req.logout();
    // req.flash("success", "You have been logged out");
    res.redirect('/login');
});

module.exports = router;
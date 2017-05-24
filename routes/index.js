/*jslint node: true*/
'use strict';

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    authorization = require('../helpers/authorization.js'),
    rpass = require('../helpers/randomPassword.js'),
    nodemailer = require('nodemailer'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    emailWriter = require('../helpers/recoveryEmail');

// index route
router.get('/', authorization.isViewer, function (req, res) {
    res.render('landing.njk');
});

// login route
router.get('/login', function (req, res) {
    res.render('login.njk');
});

// login logic goes here
router.post('/login', passport.authenticate('local', {
    successRedirect: '/password_reset_check',
    failureRedirect: '/login',
    failureFlash: true
}));

// check for password reset
router.get('/password_reset_check', authorization.isViewer, function (req, res) {
    if (req.user.needs_reset) {
        res.redirect('/password_reset');
    } else {
        res.redirect('/');
    }
});

// password reset
router.get('/password_reset', authorization.isViewer, function (req, res) {
    res.render('password_reset.njk');
});

// password reset put request
router.put('/password_reset', authorization.isViewer, function (req, res) {
    User.findById(req.user._id, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/');
        } else {
            foundUser.setPassword(req.body.password, function () {
                foundUser.needs_reset = false;
                foundUser.save();
                req.flash("success", "Your password has been successfully changed.");
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
    var username = req.body.username,
        newPassword,
        client,
        email;
    User.findOne({ username: username }, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/recovery');
        } else if (!foundUser) {
            req.flash("error", "Username does not exist.");
            res.redirect('/recovery');
        } else {
            // create a random password string
            newPassword = rpass();
            foundUser.setPassword(newPassword, function () {
                foundUser.needs_reset = true;
                foundUser.save();
                
                client = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASS
                    }
                });
                
                email = {
                    from: 'Wellness App <emailbot@channel14-altamonte.info>',
                    to: foundUser.username,
                    bcc: 'altamonte.springs.channel.14@gmail.com',
                    subject: 'Password Reset',
                    text: 'Your temporary password: ' + newPassword,
                    html: emailWriter(foundUser.username, newPassword)
                };
                
                client.sendMail(email, function (err, info) {
                    if (err) {
                        req.flash("error", "Unable to send recovery email at this time.");
                        res.redirect('/login');
                    } else {
                        req.flash("success", "A temporary password has been sent to " + foundUser.username);
                        res.redirect('/login');
                    }
                });
            });
        }
    });
});



// logout route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "You have been logged out.");
    res.redirect('/login');
});

module.exports = router;
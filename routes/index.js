/*jslint node: true*/
'use strict';

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    authorization = require('../helpers/authorization.js'),
    rpass = require('../helpers/randomPassword.js'),
    nodemailer = require('nodemailer'),
    emailGenerator = require('../helpers/recoveryEmail');

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
    successRedirect: '/passwordResetCheck',
    failureRedirect: '/login',
    failureFlash: true
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
        transporter,
        mailOptions;
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

                // create reusable transporter object using the default SMTP transport
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'altamonte.springs.channel.14@gmail.com',
                        pass: '7ujmnhy6^YHNMJU&'
                    }
                });
                
                // setup email data
                mailOptions = {
                    from: 'Wellness App <altamonte.springs.channel.14@gmail.com>', // sender address
                    to: foundUser.username, // list of receivers
                    subject: 'Password reset', // subject line
                    text: 'use the following temporary password to logon: ' + newPassword, // plain text body
                    html: emailGenerator(foundUser.username, newPassword) // html body
                };
                
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect('/login');
                    } else {
                        req.flash("success", "An email has been sent to '" + foundUser.username + "' with login instructions.");
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
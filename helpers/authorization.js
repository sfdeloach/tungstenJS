/*jslint node: true*/

//var Campground = require('../models/campground');
//var Comment = require('../models/comment');

// all middleware goes here
var auth = {};

auth.isAdmin = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && req.user.auth_level === 'admin') {
        return next();
    } else {
        // req.flash("error", "Access requires admin level privileges");
        res.redirect("/login");
    }
};

auth.isEditor = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && (req.user.auth_level === 'editor' || req.user.auth_level === 'admin')) {
        return next();
    } else {
        // req.flash("error", "Access requires editor level privileges");
        res.redirect("/login");
    }
};

auth.isViewer = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && (req.user.auth_level === 'viewer' || req.user.auth_level === 'editor' || req.user.auth_level === 'admin')) {
        return next();
    } else {
        // req.flash("error", "Access requires viewer level privileges");
        res.redirect("/login");
    }
};

module.exports = auth;
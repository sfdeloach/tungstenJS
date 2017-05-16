/*jslint node: true*/

var auth = {};

auth.isAdmin = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && req.user.auth_level === 'admin') {
        return next();
    } else {
        req.flash("error", "Access requires admin level privileges.");
        res.redirect("/");
    }
};

auth.isEditor = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && (req.user.auth_level === 'editor' || req.user.auth_level === 'admin')) {
        return next();
    } else {
        req.flash("error", "Access requires editor level privileges.");
        res.redirect("/");
    }
};

auth.isViewer = function (req, res, next) {
    'use strict';
    if (req.isAuthenticated() && (req.user.auth_level === 'viewer' || req.user.auth_level === 'editor' || req.user.auth_level === 'admin')) {
        return next();
    } else {
        req.flash("error", "Login is required.");
        res.redirect("/login");
    }
};

module.exports = auth;
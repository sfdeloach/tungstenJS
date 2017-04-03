/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    name: {
        first: { type: String, lowercase: true },
        last: { type: String, lowercase: true }
    },
    email: { type: String, lowercase: true },
    password: String,
    needs_reset: Boolean, // if true, user redirected to create a new password, otherwise normal login occurs
    auth_level: { type: String, enum: ["admin", "editor", "viewer"] }
});

// add a bunch of useful methods to our schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
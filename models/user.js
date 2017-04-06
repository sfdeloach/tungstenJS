/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

// no password key, hash and salt are added via passport
var userSchema = new mongoose.Schema({
    username: { type: String, lowercase: true },
    email: { type: String, lowercase: true },
    needs_reset: Boolean, // if true, user redirected to create a new password, otherwise normal login occurs
    auth_level: { type: String, enum: ["admin", "editor", "viewer"] }
});

// add a bunch of useful methods to our schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
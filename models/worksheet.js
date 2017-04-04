/*jslint node: true */
"use strict";

var mongoose = require('mongoose');

var worksheetSchema = new mongoose.Schema({
    inactive_on: Date, // active if null, inactivated on the date entered if !null
    created: Date,
    is_locked: Date, // unlocked if null, locked on the date entered if !null
    title: String,
    author: mongoose.Schema.ObjectId, // from user schema
    assessments: [mongoose.Schema.ObjectId]
});

module.exports = mongoose.model("Worksheet", worksheetSchema);
/*jslint node: true */
"use strict";

var mongoose = require('mongoose');

var worksheetSchema = new mongoose.Schema({
    is_active: Timestamp, // active if null, inactivated on the date entered if !null
    created: Timestamp,
    is_locked: Timestamp, // unlocked if null, locked on the date entered if !null
    title: String,
    author: mongoose.Schema.ObjectId, // from user schema
    assessments: [mongoose.Schema.ObjectId]
});

module.exports = mongoose.model("Worksheet", worksheetSchema);
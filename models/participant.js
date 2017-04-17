/*jslint node: true */
"use strict";

var mongoose = require('mongoose');

var participantSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    dept_id: { type: String, unique: true }, // require data validation, see notes
    dob: Date,
    sex: { type: String, enum: ["m", "f"] },
    group: { type: String, enum: ["applicant", "pd", "city", "test", "other"] }
});

module.exports = mongoose.model("Participant", participantSchema);
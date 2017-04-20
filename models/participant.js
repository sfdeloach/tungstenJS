/*jslint node: true */
"use strict";

var mongoose = require('mongoose');

var participantSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    dept_id: { type: String, sparse: true }, // TODO: changed unique: true to sparse: true due to duplicate index error received...once a native insertion of participants is created, can this be reverted?
    dob: Date,
    sex: { type: String, enum: ["m", "f"] },
    group: { type: String, enum: ["applicant", "pd", "city", "test", "other"] }
});

module.exports = mongoose.model("Participant", participantSchema);
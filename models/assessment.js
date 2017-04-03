/*jslint node: true */
"use strict";

var mongoose = require('mongoose');

var assessmentSchema = new mongoose.Schema({
    is_active: Timestamp, // active if null, inactivated on the date entered if !null
    created: Timestamp,
    participant: participantSchema, // note it is not an objectId
    worksheet: mongoose.Schema.ObjectId,
    eval_date: Date,
    weight: { type: Number, min: 0 },
    heart_rate: { type: String, trim: true },
    blood_pressure: { type: String, trim: true },
    body_fat: { type: Number, min: 0 },
    flex: { type: Number, min: 0 },
    situp: { type: Number, min: 0 },
    bench: { type: Number, min: 0 },
    press: { type: Number, min: 0 },
    cardio: {
        type: { type: String, enum: ["walk", "run"] },
        time: { type: Number, min: 0 }, // in seconds
        heart_rate: { type: Number, min: 0 }
    }
});

module.exports = mongoose.model("Assessment", assessmentSchema);
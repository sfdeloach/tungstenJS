/*jslint node: true */
/*jslint nomen: true */
"use strict";

var User = require('../models/user'),
    Worksheet = require('../models/worksheet'),
    Assessment = require('../models/assessment'),
    Participant = require('../models/participant'),
    seedData = require('./seedData');

// The callbacks are executed in the following order (although coded in the reverse):
//     0. dropUserData --> create user data
//     1. dropWorksheetData
//     2. dropAssessmentData
//     3. dropParticipantData
//     4. createData (welcome to callback hell)

function createData() {
    Worksheet.create(seedData.worksheetData, function (err, newWorksheet) {
        if (err) {
            console.log(err);
        } else {
            console.log("...worksheet created:   " + newWorksheet._id);
            seedData.participantData.forEach(function (partSeed) {
                // create a participant
                Participant.create(partSeed, function (err, newParticipant) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("...participant created: " + newParticipant._id);
                        // prepare the assessment data by injecting participant data, note that this is NOT an id
                        seedData.assessmentData.participant = partSeed;
                        // create the assessment
                        Assessment.create(seedData.assessmentData, function (err, newAssessment) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("...assessment created:  " + newAssessment._id);
                                // push assessment to worksheet.assessments array
                                // newWorksheet.assessments.addToSet(newAssessment);
                                // newWorksheet.save();
                                Worksheet.update({ _id: newWorksheet._id }, { $push: { assessments: newAssessment._id }}, function (err, updatedWorksheet) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Saved %s to worksheet", newAssessment._id);
                                    }
                                });
                            }
                        });
                    }
                });
            });
            // associate a user to the worksheet
            User.findOne({ 'username': 'editor' }, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Found editor at: " + foundUser._id);
                    Worksheet.update({ _id: newWorksheet._id }, { $set: { author: foundUser._id }}, function (err, updatedWorksheet) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Saved user to worksheet");
                        }
                    });
                }
            });
        }
    });
}

function dropParticipantData() {
    Participant.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Participant collection dropped");
            createData();
        }
    });
}

function dropAssessmentData() {
    Assessment.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Assessment collection dropped");
            dropParticipantData();
        }
    });
}

function dropWorksheetData() {
    Worksheet.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Worksheet collection dropped");
            dropAssessmentData();
        }
    });
}

function dropUserData() {
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("User collection dropped");
            dropWorksheetData();
            // add three levels of users users
            seedData.userData.forEach(function (userSeed) {
                User.create(userSeed, function (err, newUser) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("...user created:        " + newUser._id);
                    }
                });
            });
        }
    });
}

function seedDb() {
    dropUserData();
}

module.exports = seedDb;
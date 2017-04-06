/*jslint node: true */
/*jslint nomen: true */
"use strict";

var User = require('../models/user'),
    Worksheet = require('../models/worksheet'),
    Assessment = require('../models/assessment'),
    Participant = require('../models/participant'),
    seedData = require('./seedData'),
    verbose = false;

// The callbacks are executed in the following order (although coded in the reverse):
//     0. dropUserData
//     1. createUserData
//     2. dropWorksheetData
//     3. dropAssessmentData
//     4. dropParticipantData
//     5. createWorksheet
//     6. createParticipants
//     7. assignWorksheetAuthor

function assignWorksheetAuthor(newWorksheet) {
    User.findOne({ 'username': 'editor' }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            Worksheet.update({ _id: newWorksheet._id }, { $set: { author: foundUser._id }}, function (err, updatedWorksheet) {
                if (err) {
                    console.log(err);
                } else {
                    if (verbose) {
                        console.log("Assigned an author to the worksheet...(_id: %s)", foundUser._id);
                    }
                }
            });
        }
    });
}

function createParticipants(newWorksheet) {
    var participantsCreated = 0;
    seedData.participantData.forEach(function (partSeed, index, array) {
        Participant.create(partSeed, function (err, newParticipant) {
            if (err) {
                console.log(err);
            } else {
                if (verbose) {
                    console.log("...participant created: " + newParticipant._id);
                }
                // add participant info to the assessment seed
                seedData.assessmentData.participant = partSeed;
                // create the assessment
                Assessment.create(seedData.assessmentData, function (err, newAssessment) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (verbose) {
                            console.log("...assessment created:  " + newAssessment._id);
                        }
                        // push assessment to worksheet.assessments array
                        Worksheet.update({ _id: newWorksheet._id }, { $push: { assessments: newAssessment._id }}, function (err, updatedWorksheet) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (verbose) {
                                    console.log("Saved an assessment to worksheet...(_id: %s)", newAssessment._id);
                                }
                                participantsCreated += 1;
                                if (array.length === participantsCreated) {
                                    console.log("Finished database seeding...");
                                }
                            }
                        });
                    }
                });
            }
        });
    });
}

function createWorksheet() {
    // create a single worksheet
    Worksheet.create(seedData.worksheetData, function (err, newWorksheet) {
        if (err) {
            console.log(err);
        } else {
            if (verbose) {
                console.log("...worksheet created:   " + newWorksheet._id);
            }
            createParticipants(newWorksheet);
            assignWorksheetAuthor(newWorksheet);
        }
    });
}

function dropParticipantData() {
    Participant.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (verbose) {
                console.log("Participant collection dropped...");
            }
            createWorksheet();
        }
    });
}

function dropAssessmentData() {
    Assessment.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (verbose) {
                console.log("Assessment collection dropped...");
            }
            dropParticipantData();
        }
    });
}

function dropWorksheetData() {
    Worksheet.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (verbose) {
                console.log("Worksheet collection dropped...");
            }
            dropAssessmentData();
        }
    });
}

function createUserData() {
    var usersCreated = 0;
    seedData.userData.forEach(function (userSeed, index, array) {
        User.register(userSeed, userSeed.password, function (err, newUser) {
            if (err) {
                console.log(err);
            } else {
                if (verbose) {
                    console.log("...user created:        " + newUser._id);
                }
                usersCreated += 1;
                // script cannot continue until all users are created
                if (array.length === usersCreated) {
                    if (verbose) {
                        console.log("Finished creating users...");
                    }
                    dropWorksheetData();
                }
            }
        });
    });
}

function dropUserData() {
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (verbose) {
                console.log("User collection dropped...");
            }
            createUserData();
        }
    });
}

function seedDb(verboseOption) {
    if (verboseOption !== undefined) {
        verbose = verboseOption.verbose;
    }
    console.log("Starting database seeding (verbose = %s)", verbose);
    dropUserData();
}

module.exports = seedDb;

/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    Participant = require('../models/participant'),
    Assessment = require('../models/assessment'),
    Worksheet = require('../models/worksheet'),
    seedData = require('./seedData');

function createAssessmentData(seed) {
    // first create a participant
    Participant.create(seed, function (err, participant) {
        if (err) {
            console.log(err);
        } else {
            console.log("...added " + seed.name.last + " to participant collection");
            // next prepare the assessment data by injecting participant data
            seedData.assessmentData.participant = seed;
            // finally create the assessment
            Assessment.create(seedData.assessmentData, function (err, assessment) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("...assessment added to " + seed.name.last);
                }
            });
        }
    });
}

function dropAssessmentData() {
    Assessment.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("...assessment collection dropped");
            seedData.participantData.forEach(createAssessmentData);
        }
    });
}

function dropParticipantData() {
    Participant.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("...participant collection dropped");
            dropAssessmentData();
        }
    });
}

// This is the function that starts a number of callback functions that seed the db
// The callbacks are executed in the following order (although coded in the reverse):
//     0. ??? dropWellness
//     1. dropParticipantData
//     2. dropAssessmentData
//     3. createParticipantData and createAssessmentData
function seedDb() {
    dropParticipantData();
}

//function seedDb() {
//    // Wipeout the comments and campground collection
//    Comment.remove({}, function (err) {
//        if (err) {
//            console.log(err);
//        } else {
//            console.log('...comment collection dropped');
//            Campground.remove({}, function (err) {
//                if (err) {
//                    console.log(err);
//                } else {
//                    console.log('...campground collection dropped');
//                    // Add campgrounds
//                    campgroundData.forEach(function (seed) {
//                        Campground.create(seed, function (err, campground) {
//                            if (err) {
//                                console.log(err);
//                            } else {
//                                console.log('...added a campground');
//                                // Create and attach a comment
//                                Comment.create({
//                                    text: "Meatloaf pork belly boudin short ribs landjaeger burgdoggen.",
//                                    author: "Homer Simpson"
//                                }, function (err, comment) {
//                                    if (err) {
//                                        console.log(err);
//                                    } else {
//                                        campground.comments.push(comment);
//                                        campground.save();
//                                        console.log('...created new comment');
//                                    }
//                                });
//                            }
//                        });
//                    });
//                }
//            });
//        }
//    });
//}

module.exports = seedDb;
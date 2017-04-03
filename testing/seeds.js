/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    Participant = require('../models/participant'),
    Assessment = require('../models/assessment'),
    Worksheet = require('../models/worksheet'),
    participantData = require('./seedData');

function addParticipantData(seed) {
    Participant.create(seed, function (err, participant) {
        if (err) {
            console.log(err);
        } else {
            console.log("...added " + seed.name.last + " to participant collection");
            // next function goes here
            
        }
    });
}

function seedDb() {
    Participant.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("...participant collection dropped");
            participantData.forEach(addParticipantData);
        }
    });
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
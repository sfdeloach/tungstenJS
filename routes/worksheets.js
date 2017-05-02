/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    dateHelper = require('../helpers/myDatetime'),
    Participant = require('../models/participant'),
    User = require('../models/user'),
    Worksheet = require('../models/worksheet');

// worksheet index
router.get('/', function (req, res) {
    var totalWorksheets = 0;
    Worksheet.count({}, function (err, count) {
        if (err) {
            console.log(err);
        }
        Worksheet.find({}, function (err, foundWorksheets) {
            if (err) {
                console.log(err);
            } else if (count === 0) {
                res.render('worksheets/index.njk', {
                    worksheets: foundWorksheets
                });
            } else {
                foundWorksheets.forEach(function (worksheet) {
                    worksheet.prettyDate = new Date(worksheet.created).toLocaleDateString();
                    totalWorksheets += 1;
                    if (totalWorksheets === count) {
                        res.render('worksheets/index.njk', {
                            worksheets: foundWorksheets
                        });
                    }
                });
            }
        });
    });
});

// new worksheet form
router.get('/new', function (req, res) {
    res.render('worksheets/new.njk');
});

// create new worksheet
router.post('/', function (req, res) {
    // TODO: use the logged in user here instead of finding the admin user
    User.findOne({username: "admin"}, function (err, foundUser) {
        var newWorksheet = req.body.worksheet;
        newWorksheet.created = new Date();
        newWorksheet.inactive_on = null;
        newWorksheet.is_locked = null;
        newWorksheet.author = foundUser;
        newWorksheet.assessments = [];
        Worksheet.create(newWorksheet, function (err, createdWorksheet) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/worksheets');
            }
        });
    });
});

// show a worksheet and its assessments
router.get('/:worksheet_id', function (req, res) {
    var worksheet_id = req.params.worksheet_id;
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (err) {
            console.log(err);
        } else {
            foundWorksheet.prettyDate = function (date) {
                return new Date(date).toLocaleDateString();
            };
            Participant.find({}, function (err, foundParticipants) {
                res.render('worksheets/show.njk', {
                    worksheet: foundWorksheet,
                    participants: foundParticipants
                });
            });
        }
    });
});

// create and append a new assessment to a worksheet
router.post('/:worksheet_id', function (req, res) {
    var worksheet_id = req.params.worksheet_id,
        newAssessment = req.body.assessment,
        min = parseInt(newAssessment.cardio_min, 10),
        sec = parseInt(newAssessment.cardio_sec, 10),
        cardio = {
            type: newAssessment.cardio_type,
            min: min,
            sec: sec,
            time: min + ":" + ((sec < 10) ? ("0" + sec) : sec),
            heart_rate: (newAssessment.cardio_type === 'walk') ? newAssessment.cardio_heartrate : null
        };
    newAssessment.cardio = cardio;
    newAssessment.inactive_on = null;
    newAssessment.created = new Date();
    newAssessment.eval_date = dateHelper.htmlToDb(newAssessment.eval_date);
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (err) {
            console.log(err);
        }
        Participant.findOne({
            'dept_id': newAssessment.dept_id
        }, function (err, foundParticipant) {
            newAssessment.participant = foundParticipant;
            foundWorksheet.assessments.push(newAssessment);
            foundWorksheet.save(function (err, updatedWorksheet) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.redirect("/worksheets/" + worksheet_id);
                }
            });
        });
    });
});

// update an assessment (this route is hit via ajax call)
router.put('/:worksheet_id', function (req, res) {
    var updateData = req.body,
        worksheet_id = req.params.worksheet_id;
    
    updateData.eval_date += "T00:00:00.000Z";
    updateData.eval_date = dateHelper.htmlToDb(updateData.eval_date);
    updateData.weight = parseInt(updateData.weight, 10);
    updateData.body_fat = parseFloat(updateData.body_fat, 10);
    updateData.flex = parseFloat(updateData.flex, 10);
    updateData.situp = parseInt(updateData.situp, 10);
    updateData.bench = parseInt(updateData.bench, 10);
    updateData.leg = parseInt(updateData.leg, 10);
    updateData.cardio.min = parseInt(updateData.cardio.min, 10);
    updateData.cardio.sec = parseInt(updateData.cardio.sec, 10);
    updateData.cardio.time = updateData.cardio.min + ":" +
        ((updateData.cardio.sec < 10) ? ("0" + updateData.cardio.sec) : updateData.cardio.sec);
    updateData.cardio.heart_rate = (updateData.cardio.type === 'walk') ? parseInt(updateData.cardio.heart_rate, 10) : null;
    
    Worksheet.update({
        'assessments._id': updateData.id
    }, {
        '$set': {
            'assessments.$.eval_date': updateData.eval_date,
            'assessments.$.heart_rate': updateData.heart_rate,
            'assessments.$.blood_pressure': updateData.blood_pressure,
            'assessments.$.weight': updateData.weight,
            'assessments.$.body_fat': updateData.body_fat,
            'assessments.$.flex': updateData.flex,
            'assessments.$.situp': updateData.situp,
            'assessments.$.bench': updateData.bench,
            'assessments.$.leg': updateData.leg,
            'assessments.$.cardio.type': updateData.cardio.type,
            'assessments.$.cardio.min': updateData.cardio.min,
            'assessments.$.cardio.time': updateData.cardio.time,
            'assessments.$.cardio.heart_rate': updateData.cardio.heart_rate
        }
    }, function (err, updateInfo) {
        if (err) {
            console.log("An error occurred!");
            console.log(err);
        } else {
            console.log(updateData);
            res.send(updateData);
        }
    });
});

// calculate worksheet and display results
router.get('/:worksheet_id/calc', function (req, res) {
    var worksheet_id = req.params.worksheet_id;
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (!foundWorksheet) {
            console.log("no worksheet was found!!!");
            res.send('Sorry, the requested worksheet results is not available...<a href="/worksheets">Return to worksheets</a>');
        } else if (err) {
            console.log(err);
            res.send(err);
        } else {
            // sort assessments alphabetically by last name
            foundWorksheet.assessments = foundWorksheet.assessments.sort(function (a, b) {
                return a.participant.name.last.localeCompare(b.participant.name.last);
            });
            // add function to prettify date for use inside the template
            foundWorksheet.prettyDate = function (date) {
                return new Date(date).toLocaleDateString();
            };
            res.render('worksheets/calc.njk', {
                worksheet: foundWorksheet
            });
        }
    });
});

// remove an assessment from a worksheet
router['delete']('/:worksheet_id/:assessment_id', function (req, res) {
    var worksheetID = req.params.worksheet_id,
        assessmentID = req.params.assessment_id;
    Worksheet.update({
        _id: worksheetID
    }, {
        $pull: {
            assessments: {
                _id: assessmentID
            }
        }
    }, function (err, obj) {
        if (err) {
            console.log(err);
        }
        res.redirect("/worksheets/" + worksheetID);
    });
});

// destroy a worksheet
router['delete']('/:id', function (req, res) {
    Worksheet.findByIdAndRemove(req.params.id, function (err) {
        res.redirect("/worksheets");
    });
});

module.exports = router;

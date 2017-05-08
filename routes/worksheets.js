/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    dateHelper = require('../helpers/myDatetime'),
    Participant = require('../models/participant'),
    User = require('../models/user'),
    Worksheet = require('../models/worksheet'),
    authorization = require('../helpers/authorization.js');

// worksheet index
router.get('/', authorization.isViewer, function (req, res) {
    var totalWorksheets = 0;
    Worksheet.count({}, function (err, count) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/');
        }
        Worksheet.find({}, function (err, foundWorksheets) {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/');
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
router.get('/new', authorization.isEditor, function (req, res) {
    res.render('worksheets/new.njk');
});

// create new worksheet
router.post('/', authorization.isEditor, function (req, res) {
    // TODO: use the logged in user here instead of finding the admin user
    User.findOne({ username: "admin@altamonte.org" }, function (err, foundUser) {
        var newWorksheet = req.body.worksheet;
        newWorksheet.created = new Date();
        newWorksheet.inactive_on = null;
        newWorksheet.is_locked = null;
        newWorksheet.author = foundUser;
        newWorksheet.assessments = [];
        Worksheet.create(newWorksheet, function (err, createdWorksheet) {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/worksheets');
            } else {
                req.flash("success", "A new worksheet was successfully created.");
                res.redirect('/worksheets');
            }
        });
    });
});

// show a worksheet and its assessments
router.get('/:worksheet_id', authorization.isViewer, function (req, res) {
    var worksheet_id = req.params.worksheet_id;
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/worksheets');
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
router.post('/:worksheet_id', authorization.isEditor, function (req, res) {
    var worksheet_id = req.params.worksheet_id,
        newAssessment = req.body.assessment;
    
    newAssessment.cardio = {
        type: newAssessment.cardio_type,
        min: parseInt(newAssessment.cardio_min, 10),
        sec: parseInt(newAssessment.cardio_sec, 10),
        heart_rate: (newAssessment.cardio_type === 'walk') ? newAssessment.cardio_heartrate : null
    };
    newAssessment.cardio.time = newAssessment.cardio.min + ":" + ((newAssessment.cardio.sec < 10) ?
            ("0" + newAssessment.cardio.sec) : newAssessment.cardio.sec);
    newAssessment.inactive_on = null;
    newAssessment.created = new Date();
    newAssessment.eval_date = dateHelper.htmlToDb(newAssessment.eval_date);
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/worksheets');
        }
        Participant.findOne({
            'dept_id': newAssessment.dept_id
        }, function (err, foundParticipant) {
            newAssessment.participant = foundParticipant;
            foundWorksheet.assessments.push(newAssessment);
            foundWorksheet.save(function (err, updatedWorksheet) {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect('/worksheets');
                } else {
                    req.flash("success", "New assessment successfully saved to the worksheet.");
                    res.redirect("/worksheets/" + worksheet_id);
                }
            });
        });
    });
});

// update an assessment (this route is accessed only via ajax call)
router.put('/:worksheet_id', authorization.isEditor, function (req, res) {
    var updateData = req.body,
        worksheet_id = req.params.worksheet_id;
    
    updateData.eval_date = dateHelper.htmlToDb(updateData.eval_date + "T00:00:00.000Z");
    updateData.cardio.time = updateData.cardio.min + ":" + ((parseInt(updateData.cardio.sec, 10) < 10) ?
                    ("0" + parseInt(updateData.cardio.sec, 10)) : parseInt(updateData.cardio.sec, 10));
    updateData.cardio.heart_rate = (updateData.cardio.type === 'walk' && updateData.cardio.heart_rate.length > 0) ?
                    parseInt(updateData.cardio.heart_rate, 10) : null;
    
    Worksheet.update({
        'assessments._id': updateData.assessment_id
    }, {
        '$set': {
            'assessments.$.eval_date': updateData.eval_date,
            'assessments.$.heart_rate': updateData.heart_rate,
            'assessments.$.blood_pressure': updateData.blood_pressure,
            'assessments.$.weight': parseInt(updateData.weight, 10),
            'assessments.$.body_fat': parseFloat(updateData.body_fat, 10),
            'assessments.$.flex': parseFloat(updateData.flex, 10),
            'assessments.$.situp': parseInt(updateData.situp, 10),
            'assessments.$.bench': parseInt(updateData.bench, 10),
            'assessments.$.leg': parseInt(updateData.leg, 10),
            'assessments.$.cardio.type': updateData.cardio.type,
            'assessments.$.cardio.min': parseInt(updateData.cardio.min, 10),
            'assessments.$.cardio.sec': parseInt(updateData.cardio.sec, 10),
            'assessments.$.cardio.time': updateData.cardio.time,
            'assessments.$.cardio.heart_rate': updateData.cardio.heart_rate
        }
    }, function (err, updateInfo) {
        if (err) {
            console.log("An error occurred during an AJAX assessment update!");
            console.log("The update object that caused the error: ");
            console.dir(updateData);
            console.log(err);
        } else {
            res.send(updateData);
        }
    });
});

// calculate worksheet and display results
router.get('/:worksheet_id/calc', authorization.isViewer, function (req, res) {
    var worksheet_id = req.params.worksheet_id;
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (!foundWorksheet) {
            console.log("no worksheet was found!!!");
            res.send('Sorry, the requested worksheet results is not available...<a href="/worksheets">Return to worksheets</a>');
        } else if (err) {
            req.flash("error", err.message);
            res.redirect("/worksheets");
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
router['delete']('/:worksheet_id/:assessment_id', authorization.isEditor, function (req, res) {
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
            req.flash("error", err.message);
            res.redirect('/worksheets');
        }
        res.redirect('/worksheets/' + worksheetID);
    });
});

// destroy a worksheet
router['delete']('/:id', authorization.isEditor, function (req, res) {
    Worksheet.findByIdAndRemove(req.params.id, function (err) {
        res.redirect('/worksheets');
    });
});

module.exports = router;

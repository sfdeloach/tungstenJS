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
    User.findOne({ username: req.user.username }, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/worksheets');
        } else {
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
        }
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

// calculate worksheet and display results
router.get('/:worksheet_id/calc', authorization.isViewer, function (req, res) {
    var worksheet_id = req.params.worksheet_id;
    
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (!foundWorksheet) {
            req.flash("error", "The requested worksheet results are not available.");
            res.redirect("/worksheets");
        } else if (err) {
            req.flash("error", err.message);
            res.redirect("/worksheets");
        } else {
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

// certificate form
router.get('/:worksheet_id/certificates', authorization.isEditor, function (req, res) {
    res.render('worksheets/certificate_form.njk', {
        worksheet_id: req.params.worksheet_id
    });
});

// create certificates
router.post('/:worksheet_id/certificates', authorization.isEditor, function (req, res) {
    var worksheet_id = req.params.worksheet_id,
        certData = req.body,
        dateResult,
        dateTime;
    
    Worksheet.findById(worksheet_id, function (err, foundWorksheet) {
        if (!foundWorksheet) {
            req.flash("error", "The requested worksheet results is not available.");
            res.redirect("/worksheets");
        } else if (err) {
            req.flash("error", err.message);
            res.redirect("/worksheets");
        } else {
            foundWorksheet.assessments = foundWorksheet.assessments.sort(function (a, b) {
                return a.participant.name.last.localeCompare(b.participant.name.last);
            });
            
            // add function to prettify date for use inside the template, adjusted forward six hours due to UTC
            foundWorksheet.prettyDate = function (date) {
                dateTime = new Date(date).getTime() + (6 * 60 * 60 * 1000);
                dateResult = new Date(dateTime);
                return dateResult.toLocaleDateString();
            };
            
            res.render('worksheets/certificates.njk', {
                worksheet: foundWorksheet,
                certificateData: certData
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
        } else {
            req.flash("success", "Assessment removed from the worksheet.");
            res.redirect('/worksheets/' + worksheetID);
        }
    });
});

// destroy a worksheet
router['delete']('/:id', authorization.isEditor, function (req, res) {
    Worksheet.findByIdAndRemove(req.params.id, function (err) {
        res.redirect('/worksheets');
    });
});

module.exports = router;

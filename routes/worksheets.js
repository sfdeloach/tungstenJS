/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    Participant = require('../models/participant'),
    Worksheet = require('../models/worksheet'),
    User = require('../models/user');

// index route
router.get('/', function (req, res) {
    var totalWorksheets = 0;
    Worksheet.count({}, function (err, count) {
        if (err) {
            console.log(err);
        }
        Worksheet.find({}, function (err, foundWorksheets) {
            if (err) {
                console.log(err);
            }
            foundWorksheets.forEach(function (worksheet) {
                worksheet.prettyDate = new Date(worksheet.created).toLocaleDateString();
                totalWorksheets  += 1;
                if (totalWorksheets === count) {
                    res.render('worksheets/index.njk', {
                        worksheets: foundWorksheets
                    });
                }
            });
        });
    });
});

// show route
router.get('/:id', function (req, res) {
    var id = req.params.id;
    Worksheet.findById(id, function (err, foundWorksheet) {
        if (err) {
            console.log(err);
        }
        res.render('worksheets/show.njk', {
            worksheet: foundWorksheet
        });
    });
});

// edit route
router.get('/:id/edit', function (req, res) {
    var id = req.params.id;
    Worksheet.findById(id, function (err, foundWorksheet) {
        if (err) {
            console.log(err);
        }
        Participant.find({}, function (err, foundParticipants) {
            res.render('worksheets/edit.njk', {
                worksheet: foundWorksheet,
                participants: foundParticipants
            });
        });
    });
});

module.exports = router;
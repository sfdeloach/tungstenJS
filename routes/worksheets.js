/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    Worksheet = require('../models/worksheet'),
    User = require('../models/user');

// index route
router.get('/', function (req, res) {
    Worksheet.count({}, function (err, count) {
        Worksheet.find({}, function (err, foundWorksheets) {
            var usernamesFound = 0,
                worksheetsArray = [];
            console.log(foundWorksheets);
            if (err) {
                console.log(err);
            }
            foundWorksheets.forEach(function (worksheet) {
                User.findOne({ _id: worksheet.author }, function (err, foundUser) {
                    if (err) {
                        console.log(err);
                    }
                    worksheet.username = foundUser.username;
                    worksheet.createdDate = worksheet.created.toLocaleString();
                    worksheetsArray.push(worksheet);
                    usernamesFound += 1;
                    if (usernamesFound === count) {
                        worksheetsArray.sort(function (a, b) {
                            return b.created - a.created;
                        });
                        res.render('worksheets/index.njk', {
                            worksheets: worksheetsArray
                        });
                    }
                });
            });
        });
    });
});

// show route
router.get('/:id', function (req, res) {
    var id = req.params.id;
    Worksheet.findById(id).populate("assessments").exec(function (err, foundWorksheet) {
        if (err) {
            console.log(err);
        }
        res.render('worksheets/show.njk', {
            worksheet: foundWorksheet
        });
    });
});

module.exports = router;
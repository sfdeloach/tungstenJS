/*jslint node: true*/
/*jslint nomen: true*/
'use strict';

var express = require("express"),
    router = express.Router(),
    Participant = require('../models/participant'),
    dateHelper = require('../helpers/myDatetime'),
    //User = require('../models/user'),
    Worksheet = require('../models/worksheet'),
    authorization = require('../helpers/authorization.js');

// return a list of existing police dept id numbers, used at participants/new.njk when creating a new participant
router.get('/participants/get_ids', authorization.isEditor, function (req, res) {
    var key,
        result = [];
    Participant.find({ 'group': 'pd' }, { 'dept_id': 1, '_id': 0 }, function (err, foundParticipants) {
        if (err) {
            res.send('error');
        } else {
            foundParticipants.forEach(function (element) {
                result.push(element.dept_id);
            });
            res.send(result);
        }
    });
    
});

// verify a participant exists, used at worksheets/show.njk when attempting to save a new assessment
router.post('/participants/id_exists', authorization.isEditor, function (req, res) {
    var dept_id = req.body.dept_id;
    
    Participant.findOne({ 'dept_id': dept_id }, function (err, foundParticipant) {
        if (err) {
            res.send('error');
        } else if (foundParticipant) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

// update an assessment, used at worksheets/show.njk when an assessment is updated in the table body
router.put('/worksheets/:worksheet_id', authorization.isEditor, function (req, res) {
    var updateData = req.body,
        worksheet_id = req.params.worksheet_id;
    
    updateData.eval_date = dateHelper.htmlToDb(updateData.eval_date + "T00:00:00.000Z");
    updateData.cardio.time = updateData.cardio.min + ":" + ((parseInt(updateData.cardio.sec, 10) < 10) ?
                    ("0" + parseInt(updateData.cardio.sec, 10)) : parseInt(updateData.cardio.sec, 10));
    updateData.cardio.heart_rate = (updateData.cardio.type === 'walk' && updateData.cardio.heart_rate.length > 0) ?
                    parseInt(updateData.cardio.heart_rate, 10) : null;
    
    Worksheet.updateOne({
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

module.exports = router;
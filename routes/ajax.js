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

// verify a participant exists, used at worksheets/show.njk when attempting to save a new assessment
router.post('/participants/check_id', authorization.isEditor, function (req, res) {
    var dept_id = req.body.dept_id,
        result = false;
    
    Participant.findOne({ 'dept_id': dept_id }, function (err, foundParticipant) {
        if (foundParticipant) {
            result = true;
        }
        res.send(result);
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

module.exports = router;
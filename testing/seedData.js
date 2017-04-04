/*jslint node: true */
"use strict";

// dummy test data, not actual PII

var participantData = [
    {
        "name": {
            "first": "Jimmy",
            "last": "Couch"
        },
        "dept_id": "154",
        "dob": "5/9/1980",
        "sex": "m",
        "group": "pd"
    },
    {
        "name": {
            "first": "Sarah",
            "last": "Smatters"
        },
        "dept_id": "475",
        "dob": "3/8/1971",
        "sex": "f",
        "group": "pd"
    },
    {
        "name": {
            "first": "Skip",
            "last": "Phillips"
        },
        "dept_id": "653",
        "dob": "3/13/1968",
        "sex": "m",
        "group": "pd"
    }
];

var assessmentData = {
    inactive_on: null, // date inactivated
    created: "4/3/2017",
    participant: null, // add later???
    worksheet: null, // object id
    eval_date: "4/3/2017",
    weight: 175,
    heart_rate: "72",
    blood_pressure: "120/80",
    body_fat: 15.2,
    flex: 27.5,
    situp: 51,
    bench: 225,
    press: 425,
    cardio: {
        type: "walk",
        time: 722, // in seconds
        heart_rate: 132
    }
};

var seedData = {
    participantData: participantData,
    assessmentData: assessmentData
};

module.exports = seedData;

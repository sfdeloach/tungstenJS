/*jslint node: true */
"use strict";

/*******************************************************************************************************************
 *                                                                                                                 *
 * NOTE:                                                                                                           *
 *                                                                                                                 *
 * This script is no longer valid, it is based on a slightly different schema, please refer to the file 'data.js'  *
 * for mongo commands that manually populate the database for testing                                              *
 *                                                                                                                 *
 *******************************************************************************************************************/

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
    },
    {
        "name": {
            "first": "City",
            "last": "Worker"
        },
        "dept_id": "c1",
        "dob": "3/13/1968",
        "sex": "m",
        "group": "city"
    },
    {
        "name": {
            "first": "Another City",
            "last": "Worker"
        },
        "dept_id": "c2",
        "dob": "3/13/1968",
        "sex": "m",
        "group": "city"
    },
    {
        "name": {
            "first": "Saul",
            "last": "Goodman"
        },
        "dept_id": "777",
        "dob": "5/3/1962",
        "sex": "m",
        "group": "applicant"
    }
];

var assessmentData = {
    inactive_on: null, // date inactivated
    created: new Date(),
    participant: null, // object id added later
    worksheet: null, // object id added later
    eval_date: new Date(),
    weight: 185,
    heart_rate: "72",
    blood_pressure: "120/80",
    body_fat: 15.2,
    flex: 27.5,
    situp: 51,
    bench: 225,
    leg: 425,
    cardio: {
        type: "walk",
        time: 722, // in seconds
        heart_rate: 132
    }
};

var worksheetData = {
    inactive_on: null,
    created: new Date(),
    is_locked: null,
    title: "Wellness Test Worksheet",
    author: null, // object ID
    assessments: [] // array of object IDs
};

var userData = [
    {
        username: "admin",
        email: "admin@tungsten.info",
        password: "admin",
        needs_reset: true,
        auth_level: "admin"
    },
    {
        username: "editor",
        email: "editor@tungsten.info",
        password: "editor",
        needs_reset: true,
        auth_level: "editor"
    },
    {
        username: "viewer",
        email: "viewer@tungsten.info",
        password: "viewer",
        needs_reset: true,
        auth_level: "viewer"
    }
];

var seedData = {
    assessmentData: assessmentData,
    participantData: participantData,
    userData: userData,
    worksheetData: worksheetData
};

module.exports = seedData;

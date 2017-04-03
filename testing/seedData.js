/*jslint node: true */
"use strict";

// false test data, not actual PII

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

module.exports = participantData;
/*jslint devel: true*/
/*globals $: false*/
/*globals bodyTables: false*/

$(document).ready(function () {
    'use strict';
    var sex = $('.sex'),
        dob = $('.dob'),
        evalDate = $('.eval-date'),
        age = $('.age'),
        //
        body = $('.body'),
        bodyResult = $('.body-result'),
        //
        sumParticipants = evalDate.length,
        i;
    
    for (i = 0; i < sumParticipants; i += 1) {
        age[i].innerHTML = Math.floor((new Date(evalDate[i].innerHTML).getTime() - new Date(dob[i].innerHTML).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        bodyResult[i].innerHTML = bodyTables.lookup(sex[i].innerHTML, age[i].innerHTML, body[i].innerHTML);
    }
});

/*jslint devel: true*/
/*globals $: false*/

$(document).ready(function () {
    'use strict';
    var evalDate = $('.eval-date'),
        evalDateTime,
        dob = $('.dob'),
        dobTime,
        age = $('.age'),
        ageTime,
        sumParticipants = evalDate.length,
        i;
    
    for (i = 0; i < sumParticipants; i += 1) {
        evalDateTime = new Date(evalDate[i].innerHTML).getTime();
        dobTime = new Date(dob[i].innerHTML).getTime();
        ageTime = Math.floor((evalDateTime - dobTime) / (1000 * 60 * 60 * 24 * 365.25));
        age[i].innerHTML = ageTime;
    }
    
    console.log(table.benc_f_2);
});

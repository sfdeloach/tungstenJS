/*jslint devel: true*/
/*globals $: false*/
/*globals benchTables: false*/
/*globals bodyTables: false*/
/*globals flexTables: false*/

$(document).ready(function () {
    'use strict';
    var sex = $('.sex'),
        dob = $('.dob'),
        evalDate = $('.eval-date'),
        weight = $('.weight'),
        age = $('.age'),
        bench = $('.bench'),
        benchResult = $('.bench-result'),
        body = $('.body'),
        bodyResult = $('.body-result'),
        flex = $('.flex'),
        flexResult = $('.flex-result'),
        sumParticipants = evalDate.length,
        i;
    
    for (i = 0; i < sumParticipants; i += 1) {
        age[i].innerHTML = Math.floor((new Date(evalDate[i].innerHTML).getTime() - new Date(dob[i].innerHTML).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        benchResult[i].innerHTML = benchTables.lookup(sex[i].innerHTML, age[i].innerHTML, bench[i].innerHTML / weight[i].innerHTML);
        bodyResult[i].innerHTML = bodyTables.lookup(sex[i].innerHTML, age[i].innerHTML, body[i].innerHTML);
        flexResult[i].innerHTML = flexTables.lookup(sex[i].innerHTML, age[i].innerHTML, flex[i].innerHTML);
    }
});

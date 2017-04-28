/*jslint devel: true*/
/*globals $: false*/
/*globals tables: false*/

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
        leg = $('.leg'),
        legResult = $('.leg-result'),
        sit = $('.sit'),
        sitResult = $('.sit-result'),
        cardioType = $('.cardio-type'),
        cardioMin = $('.cardio-min'),
        cardioSec = $('.cardio-sec'),
        cardioHR = $('.cardio-hr'),
        cardioResult = $('.cardio-result'),
        ave = $('.ave'),
        sumParticipants = evalDate.length,
        i;

    for (i = 0; i < sumParticipants; i += 1) {
        age[i].innerHTML = Math.floor((new Date(evalDate[i].innerHTML).getTime() - new Date(dob[i].innerHTML).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        benchResult[i].innerHTML = tables.lookup("bench", sex[i].innerHTML, age[i].innerHTML, bench[i].innerHTML / weight[i].innerHTML);
        bodyResult[i].innerHTML = tables.lookup("body", sex[i].innerHTML, age[i].innerHTML, body[i].innerHTML);
        flexResult[i].innerHTML = tables.lookup("flex", sex[i].innerHTML, age[i].innerHTML, flex[i].innerHTML);
        legResult[i].innerHTML = tables.lookup("leg", sex[i].innerHTML, age[i].innerHTML, leg[i].innerHTML / weight[i].innerHTML);
        sitResult[i].innerHTML = tables.lookup("sit", sex[i].innerHTML, age[i].innerHTML, sit[i].innerHTML);
        if (cardioType[i].innerHTML === "walk") {
            cardioResult[i].innerHTML = tables.walk(sex[i].innerHTML, age[i].innerHTML, cardioMin[i].innerHTML, cardioSec[i].innerHTML, cardioHR[i].innerHTML.trim(), weight[i].innerHTML);
        } else {
            cardioResult[i].innerHTML = tables.run(sex[i].innerHTML, age[i].innerHTML, cardioMin[i].innerHTML, cardioSec[i].innerHTML);
        }
        ave[i].innerHTML = ((parseFloat(benchResult[i].innerHTML) + parseFloat(bodyResult[i].innerHTML) + parseFloat(flexResult[i].innerHTML) + parseFloat(legResult[i].innerHTML) + parseFloat(sitResult[i].innerHTML) + parseFloat(cardioResult[i].innerHTML)) / 6).toFixed(1);
    }
});

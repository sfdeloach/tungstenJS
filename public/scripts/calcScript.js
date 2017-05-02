/*jslint devel: true*/
/*globals $: false*/
/*globals tables: false*/

// Closure for round10() function
(function () {
    'use strict';
    /**
    * Decimal adjustment of a number.
    *
    * @param {String}  type  The type of adjustment.
    * @param {Number}  value The number.
    * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
    * @returns {Number} The adjusted value.
    */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // If the value is negative...
        if (value < 0) {
            return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
}());

$(document).ready(function () {
    'use strict';
    var resultRow = $('.result-row'),
        hasFailed = false,
        sex = [],
        dob = [],
        evalDate = [],
        weight = [],
        age = $('.age'),
        bench = [],
        benchResult = $('.bench-result'),
        benchAve = 0,
        body = [],
        bodyResult = $('.body-result'),
        bodyAve = 0,
        flex = [],
        flexResult = $('.flex-result'),
        flexAve = 0,
        leg = [],
        legResult = $('.leg-result'),
        legAve = 0,
        sit = [],
        sitResult = $('.sit-result'),
        sitAve = 0,
        cardioType = [],
        cardioMin = [],
        cardioSec = [],
        cardioHR = [],
        cardioResult = $('.cardio-result'),
        runAve = 0,
        walkAve = 0,
        ave = $('.ave'),
        overallAve = 0,
        totalParticipants = age.length,
        walkParticipants = 0,
        runPartiticipants = 0,
        i;
    
    $.each($('.sex'), function (index, value) {
        sex.push(value.innerHTML);
    });
    
    $.each($('.dob'), function (index, value) {
        dob.push(value.innerHTML);
    });
    
    $.each($('.eval-date'), function (index, value) {
        evalDate.push(value.innerHTML);
    });
    
    $.each($('.weight'), function (index, value) {
        weight.push(value.innerHTML);
    });
    
    $.each($('.bench'), function (index, value) {
        bench.push(value.innerHTML);
    });
    
    $.each($('.body'), function (index, value) {
        body.push(value.innerHTML);
    });
    
    $.each($('.flex'), function (index, value) {
        flex.push(value.innerHTML);
    });
    
    $.each($('.leg'), function (index, value) {
        leg.push(value.innerHTML);
    });
    
    $.each($('.sit'), function (index, value) {
        sit.push(value.innerHTML);
    });

    $.each($('.cardio-type'), function (index, value) {
        cardioType.push(value.innerHTML);
    });

    $.each($('.cardio-min'), function (index, value) {
        cardioMin.push(value.innerHTML);
    });
    
    $.each($('.cardio-sec'), function (index, value) {
        cardioSec.push(value.innerHTML);
    });

    $.each($('.cardio-hr'), function (index, value) {
        cardioHR.push(value.innerHTML);
    });
    
    for (i = 0; i < totalParticipants; i += 1) {
        age[i].innerHTML = Math.floor((new Date(evalDate[i]).getTime() - new Date(dob[i]).getTime()) / 31557600000);
        
        benchResult[i].innerHTML = tables.lookup("bench", sex[i], age[i].innerHTML, bench[i] / weight[i]);
        if (parseFloat(benchResult[i].innerHTML) < 50.0) {
            console.log("bench failed");
            hasFailed = true;
        }
        benchAve += parseFloat(benchResult[i].innerHTML);
        
        bodyResult[i].innerHTML = tables.lookup("body", sex[i], age[i].innerHTML, body[i]);
        if (parseFloat(bodyResult[i].innerHTML) < 50.0) {
            console.log("body failed");
            hasFailed = true;
        }
        bodyAve += parseFloat(bodyResult[i].innerHTML);
        
        flexResult[i].innerHTML = tables.lookup("flex", sex[i], age[i].innerHTML, flex[i]);
        if (parseFloat(flexResult[i].innerHTML) < 50.0) {
            console.log("flex failed");
            hasFailed = true;
        }
        flexAve += parseFloat(flexResult[i].innerHTML);
        
        legResult[i].innerHTML = tables.lookup("leg", sex[i], age[i].innerHTML, leg[i] / weight[i]);
        if (parseFloat(legResult[i].innerHTML) < 50.0) {
            console.log("leg failed");
            hasFailed = true;
        }
        legAve += parseFloat(legResult[i].innerHTML);
        
        sitResult[i].innerHTML = tables.lookup("sit", sex[i], age[i].innerHTML, sit[i]);
        if (parseFloat(sitResult[i].innerHTML) < 50.0) {
            console.log("sit failed");
            hasFailed = true;
        }
        sitAve += parseFloat(sitResult[i].innerHTML);
        
        if (cardioType[i] === "walk") {
            cardioResult[i].innerHTML = tables.walk(sex[i], age[i].innerHTML, cardioMin[i], cardioSec[i], cardioHR[i].trim(), weight[i]);
            walkAve += parseFloat(cardioResult[i].innerHTML);
            walkParticipants += 1;
        } else if (cardioType[i] === "run") {
            cardioResult[i].innerHTML = tables.run(sex[i], age[i].innerHTML, cardioMin[i], cardioSec[i]);
            runAve += parseFloat(cardioResult[i].innerHTML);
            runPartiticipants += 1;
        }
        if (parseFloat(cardioResult[i].innerHTML) < 50.0) {
            console.log("cardio failed");
            hasFailed = true;
        }
        
        if (!hasFailed && ((i + 1) % 2) === 0) {
            resultRow[i].className += ' shade';
        }
        
        if (hasFailed) {
            resultRow[i].className += ' fail';
            hasFailed = false;
        }
        
        // TODO!!!  Implement round10 for all calculating functions!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        
        ave[i].innerHTML = Math.round10((parseFloat(benchResult[i].innerHTML) + parseFloat(bodyResult[i].innerHTML) +
                             parseFloat(flexResult[i].innerHTML) + parseFloat(legResult[i].innerHTML) +
                             parseFloat(sitResult[i].innerHTML) + parseFloat(cardioResult[i].innerHTML)) / 6, -1).toFixed(1);
        overallAve += parseFloat(ave[i].innerHTML);
    }
    
    $('#body-ave').text((bodyAve / totalParticipants).toFixed(1) + '%');
    $('#flex-ave').text((flexAve / totalParticipants).toFixed(1) + '%');
    $('#sit-ave').text((sitAve / totalParticipants).toFixed(1) + '%');
    $('#bench-ave').text((benchAve / totalParticipants).toFixed(1) + '%');
    $('#leg-ave').text((legAve / totalParticipants).toFixed(1) + '%');
    
    if (runPartiticipants === 0) {
        $('#run-ave').text('n/a');
    } else {
        $('#run-ave').text((runAve / runPartiticipants).toFixed(1) + '%');
    }
    
    if (walkParticipants === 0) {
        $('#walk-ave').text('n/a');
    } else {
        $('#walk-ave').text((walkAve / walkParticipants).toFixed(1) + '%');
    }
    
    $('#overall-ave').text(Math.round10(overallAve / totalParticipants, -1).toFixed(1) + '%');
    $('#total-part').text(totalParticipants);
});

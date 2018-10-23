$(document).ready(function() {
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

  $.each($('.sex'), function(index, value) {
    sex.push(value.innerHTML);
  });

  $.each($('.dob'), function(index, value) {
    dob.push(value.innerHTML);
  });

  $.each($('.eval-date'), function(index, value) {
    evalDate.push(value.innerHTML);
  });

  $.each($('.weight'), function(index, value) {
    weight.push(value.innerHTML);
  });

  $.each($('.bench'), function(index, value) {
    bench.push(value.innerHTML);
  });

  $.each($('.body'), function(index, value) {
    body.push(value.innerHTML);
  });

  $.each($('.flex'), function(index, value) {
    flex.push(value.innerHTML);
  });

  $.each($('.leg'), function(index, value) {
    leg.push(value.innerHTML);
  });

  $.each($('.sit'), function(index, value) {
    sit.push(value.innerHTML);
  });

  $.each($('.cardio-type'), function(index, value) {
    cardioType.push(value.innerHTML);
  });

  $.each($('.cardio-min'), function(index, value) {
    cardioMin.push(value.innerHTML);
  });

  $.each($('.cardio-sec'), function(index, value) {
    cardioSec.push(value.innerHTML);
  });

  $.each($('.cardio-hr'), function(index, value) {
    cardioHR.push(value.innerHTML);
  });

  for (i = 0; i < totalParticipants; i += 1) {
    age[i].innerHTML = Math.floor(
      (new Date(evalDate[i]).getTime() - new Date(dob[i]).getTime()) /
        31557600000
    );

    benchResult[i].innerHTML = tables.lookup(
      'bench',
      sex[i],
      age[i].innerHTML,
      bench[i] / weight[i]
    );
    if (parseFloat(benchResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }
    benchAve += parseFloat(benchResult[i].innerHTML);

    bodyResult[i].innerHTML = tables.lookup(
      'body',
      sex[i],
      age[i].innerHTML,
      body[i]
    );
    if (parseFloat(bodyResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }
    bodyAve += parseFloat(bodyResult[i].innerHTML);

    flexResult[i].innerHTML = tables.lookup(
      'flex',
      sex[i],
      age[i].innerHTML,
      flex[i]
    );
    if (parseFloat(flexResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }
    flexAve += parseFloat(flexResult[i].innerHTML);

    legResult[i].innerHTML = tables.lookup(
      'leg',
      sex[i],
      age[i].innerHTML,
      leg[i] / weight[i]
    );
    if (parseFloat(legResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }
    legAve += parseFloat(legResult[i].innerHTML);

    sitResult[i].innerHTML = tables.lookup(
      'sit',
      sex[i],
      age[i].innerHTML,
      sit[i]
    );
    if (parseFloat(sitResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }
    sitAve += parseFloat(sitResult[i].innerHTML);

    if (cardioType[i] === 'walk') {
      cardioResult[i].innerHTML = tables.walk(
        sex[i],
        age[i].innerHTML,
        cardioMin[i],
        cardioSec[i],
        cardioHR[i].trim(),
        weight[i]
      );
      walkAve += parseFloat(cardioResult[i].innerHTML);
      walkParticipants += 1;
    } else if (cardioType[i] === 'run') {
      cardioResult[i].innerHTML = tables.run(
        sex[i],
        age[i].innerHTML,
        cardioMin[i],
        cardioSec[i]
      );
      runAve += parseFloat(cardioResult[i].innerHTML);
      runPartiticipants += 1;
    }
    if (parseFloat(cardioResult[i].innerHTML) < 50.0) {
      hasFailed = true;
    }

    ave[i].innerHTML = Math.round10(
      (parseFloat(benchResult[i].innerHTML) +
        parseFloat(bodyResult[i].innerHTML) +
        parseFloat(flexResult[i].innerHTML) +
        parseFloat(legResult[i].innerHTML) +
        parseFloat(sitResult[i].innerHTML) +
        parseFloat(cardioResult[i].innerHTML)) /
        6,
      -1
    ).toFixed(1);

    // By default, all police certificates are visible. Certificates are turned off if the average is too low.
    if (parseFloat(ave[i].innerHTML) < 75.0 || hasFailed) {
      ave[
        i
      ].parentElement.parentElement.parentElement.parentElement.hidden = true;
    } else if (parseFloat(ave[i].innerHTML) < 85.0 || hasFailed) {
      if (
        ave[i].parentElement.parentElement.parentElement.parentElement
          .className === 'new-page b-certificate'
      ) {
        ave[
          i
        ].parentElement.parentElement.parentElement.parentElement.hidden = true;
      }
    }

    // reset the fail flag for the next participant
    hasFailed = false;
  }
});

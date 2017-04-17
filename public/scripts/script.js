/*jslint devel: true*/
/*globals $: false*/

$(document).ready(function () {
    'use strict';
    $("#indexTable").tablesorter({
        sortList: [[2, 1]]
    });
    $("#showTable").tablesorter({
        sortList: [[0, 0]]
    });
});

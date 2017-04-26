/*jslint devel: true*/
/*globals $: false*/

// Edit button in worksheets/show.njk
var workShowEditRow =
    "<tr>" +
    "<form action='/worksheets/{{ worksheet._id }}' method='POST'>" +
        "<td>" +
            "<input class='form-control' list='participants' name='assessment[dept_id]' type='text' autocomplete='off' required autofocus>" +
        "</td>" +
        "<td class='col-width12'><input class='form-control' name='assessment[eval_date]' type='date' required></td>" +
        "<td><input class='form-control' name='assessment[weight]' type='number' step=1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[heart_rate]' type='text' autocomplete='off' required></td>" +
        "<td><input class='form-control' name='assessment[blood_pressure]' type='text' autocomplete='off' required></td>" +
        "<td><input class='form-control' name='assessment[body_fat]' type='number' step=0.1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[flex]' type='number' step=0.1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[situp]' type='number' step=1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[bench]' type='number' step=1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[leg]' type='number' step=1 min=0 required></td>" +
        "<td class='col-width09'>" +
            "<select class='form-control' name='assessment[cardio_type]' >" +
                "<option value='walk'>walk</option>" +
                "<option value='run'>run</option>" +
            "</select>" +
        "</td>" +
        "<td><input class='form-control' name='assessment[cardio_min]' type='number' step=1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[cardio_sec]' type='number' step=1 min=0 required></td>" +
        "<td><input class='form-control' name='assessment[cardio_heartrate]' type='number' step=1 min=0 ></td>" +
        "<td>" +
            "<input id='workshow-save' class='btn btn-success btn-sm btn-block' type='submit' value='save'>" +
        "</td>" +
    "</form>" +
    "</tr>";

$(document).ready(function () {
    'use strict';

    // Table sort
    $("#participantIndexTable").tablesorter({
        sortList: [[0, 0]]
    });
    
    $("#worksheetIndexTable").tablesorter({
        sortList: [[2, 1]]
    });

    $("#worksheetShowTable").tablesorter({
        sortList: [[0, 0]]
    });
    // END - Table sort
    
    // Items located on participants/new.njk
    $(".partnew-pd").click(function (eventObject) {
        $("#partnew-id").prop('required', true);
        $("#partnew-id").prop('disabled', false);
        $("#partnew-id").val('');
    });
    
    $(".partnew-nonpd").click(function (eventObject) {
        $("#partnew-id").prop('required', false);
        $("#partnew-id").prop('disabled', true);
        $("#partnew-id").val('auto-generated');
    });
    
    $('#partnew-form').on('submit', function (eventObject) {
        var valid = false;
        
        if ($("#partnew-id").prop('disabled')) {
            // auto generate dept_id based on the current time
            var now = new Date(),
                yy = now.getYear() - 100,
                MM = now.getMonth() < 9 ? ("0" + (now.getMonth() + 1)) : now.getMonth() + 1,
                dd = now.getDate() < 10 ? ("0" + now.getDate()) : now.getDate(),
                hh = now.getHours() < 10 ? ("0" + now.getHours()) : now.getHours(),
                mm = now.getMinutes() < 10 ? ("0" + now.getMinutes()) : now.getMinutes(),
                ss = now.getSeconds() < 10 ? ("0" + now.getSeconds()) : now.getSeconds(),
                id = yy.toString() + MM + dd + hh + mm + ss;
            $("#partnew-id").prop('disabled', false);
            $("#partnew-id").val(id);
            valid = true;
        } else {
            // TODO: check for unique PD id number
            valid = true;
        }
        
        if (!valid) {
            eventObject.preventDefault();
            alert("ERROR: ID numbers must be unique!");
        }
        
        return valid;
    });
    // END - Items located on participants/new.njk
    
    // Edit button in worksheets/show.njk
    $('.workshow-edit').click(function (eventObject) {
        $(this).parent().parent().replaceWith(workShowEditRow);
        $(".workshow-edit").prop('disabled', true);
        // TODO: autopopulate data in the fields
    });
    
    $(document).on('click', '#workshow-save', function(eventObject) {
        // TODO: PUT request to save edit to db
        location.reload();
        $(".workshow-edit").prop('disabled', false); // is this necessary if the page refreshes?
    });
});

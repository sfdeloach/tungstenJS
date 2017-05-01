/*jslint devel: true*/
/*globals $: false*/

// Edit button in worksheets/show.njk
function editParticipant(row) {
    'use strict';
    var date,
        ddyyyy,
        yyyy,
        MM,
        dd,
        cardioOption = '',
        min,
        sec,
        worksheetShowEditRow;

    ddyyyy = row.date.slice(row.date.indexOf('/') + 1);
    yyyy = ddyyyy.slice(ddyyyy.indexOf('/') + 1);
    MM = Number.parseInt(row.date.slice(0, row.date.indexOf('/')));
    dd = Number.parseInt(ddyyyy.slice(0, ddyyyy.indexOf('/')));

    if (MM < 10) {
        MM = "0" + MM;
    }

    if (dd < 10) {
        dd = "0" + dd;
    }

    date = yyyy + "-" + MM + "-" + dd;

    if (row.cardio === 'run') {
        cardioOption = 'selected';
    }

    min = Number.parseInt(row.time.slice(0, row.time.indexOf(':')));
    sec = Number.parseInt(row.time.slice(row.time.indexOf(':') + 1));

    worksheetShowEditRow =
        "<tr>" +
        "<td>" +
        "<input class='form-control' list='participants' name='assessment[dept_id]' type='text' disabled value='" + row.deptID + "'>" +
        "</td>" +
        "<td class='col-width12'><input class='form-control' name='assessment[eval_date]' type='date' required value='" + date + "'></td>" +
        "<td><input class='form-control' name='assessment[weight]' type='number' step=1 min=0 required value='" + row.weight + "'></td>" +
        "<td><input class='form-control' name='assessment[heart_rate]' type='text' autocomplete='off' required value='" + row.hr + "'></td>" +
        "<td><input class='form-control' name='assessment[blood_pressure]' type='text' autocomplete='off' required value='" + row.pressure + "'></td>" +
        "<td><input class='form-control' name='assessment[body_fat]' type='number' step=0.1 min=0 required value='" + row.body + "'></td>" +
        "<td><input class='form-control' name='assessment[flex]' type='number' step=0.1 min=0 required value='" + row.flex + "'></td>" +
        "<td><input class='form-control' name='assessment[situp]' type='number' step=1 min=0 required value='" + row.situp + "'></td>" +
        "<td><input class='form-control' name='assessment[bench]' type='number' step=1 min=0 required value='" + row.bench + "'></td>" +
        "<td><input class='form-control' name='assessment[leg]' type='number' step=1 min=0 required value='" + row.leg + "'></td>" +
        "<td>" +
        "<select class='form-control' name='assessment[cardio_type]'>" +
        "<option value='walk'>walk</option>" +
        "<option value='run'" + cardioOption + ">run</option>" +
        "</select>" +
        "</td>" +
        "<td class='col-width03'><input class='form-control' name='assessment[cardio_min]' type='number' step=1 min=0 required value='" + min + "'></td>" +
        "<td class='col-width03'><input class='form-control' name='assessment[cardio_sec]' type='number' step=1 min=0 required value='" + sec + "'></td>" +
        "<td><input class='form-control' name='assessment[cardio_heartrate]' type='number' step=1 min=0 value='" + row.cardioHR + "'></td>" +
        "<td>" +
        "<button id='workshow-save' class='btn btn-success btn-sm btn-block' type='button'>update</button>" +
        "</td>" +
        "<td class='hidden'>" + row.assessmentID + "</td>" +
        "</tr>";

    return worksheetShowEditRow;
}

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
        var valid = false,
            now,
            yy,
            MM,
            dd,
            hh,
            mm,
            ss,
            id;

        if ($("#partnew-id").prop('disabled')) {
            // auto generate dept_id based on the current time
            now = new Date();
            yy = now.getYear() - 100;
            MM = now.getMonth() < 9 ? ("0" + (now.getMonth() + 1)) : now.getMonth() + 1;
            dd = now.getDate() < 10 ? ("0" + now.getDate()) : now.getDate();
            hh = now.getHours() < 10 ? ("0" + now.getHours()) : now.getHours();
            mm = now.getMinutes() < 10 ? ("0" + now.getMinutes()) : now.getMinutes();
            ss = now.getSeconds() < 10 ? ("0" + now.getSeconds()) : now.getSeconds();
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
        var col = $(this).parent().siblings(),
            row = {};
        
        row.deptID = col[0].childNodes[1].id;
        row.date = col[1].innerHTML;
        row.weight = col[2].innerHTML;
        row.hr = col[3].innerHTML;
        row.pressure = col[4].innerHTML;
        row.body = col[5].innerHTML;
        row.flex = col[6].innerHTML;
        row.situp = col[7].innerHTML;
        row.bench = col[8].innerHTML;
        row.leg = col[9].innerHTML;
        row.cardio = col[10].innerHTML;
        row.time = col[11].innerHTML;
        row.cardioHR = col[12].innerHTML;
        row.assessmentID = col[13].innerHTML;

        $(this).parent().parent().replaceWith(editParticipant(row));
        $(".workshow-edit").prop('disabled', true);
    });

    $(document).on('click', '#workshow-save', function (eventObject) {
        $(this).html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
        
        var col = $(this).parent().siblings(),
            assessment = {},
            pathname = window.location.pathname;

        assessment.eval_date = col[1].childNodes[0].value;
        assessment.weight = col[2].childNodes[0].value;
        assessment.heart_rate = col[3].childNodes[0].value;
        assessment.blood_pressure = col[4].childNodes[0].value;
        assessment.body_fat = col[5].childNodes[0].value;
        assessment.flex = col[6].childNodes[0].value;
        assessment.situp = col[7].childNodes[0].value;
        assessment.bench = col[8].childNodes[0].value;
        assessment.leg = col[9].childNodes[0].value;
        assessment._id = col[14].innerHTML;
        assessment.cardio = {};
        assessment.cardio.type = col[10].childNodes[0].value;
        assessment.cardio.min = col[11].childNodes[0].value;
        assessment.cardio.sec = col[12].childNodes[0].value;
        assessment.cardio.heart_rate = col[13].childNodes[0].value;
        
        $.ajax({ url: pathname + "?_method=PUT",
                data: assessment,
                type: "POST"
            })
            .done(function (json) {
                // 'json' is data (if any) provided back to the browser from the server
                console.log("The server said: " + json);
                location.reload(); // TODO: sloppy??? cleaner to update the dom instead of a complete refresh???
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            });
    });
});

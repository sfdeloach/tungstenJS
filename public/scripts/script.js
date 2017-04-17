/*jslint devel: true*/
/*globals $: false*/

var newTableRowForm =
    "<tr>" +
    "<form>" +
    "    <td class='name-col'><input class='form-control' type='text'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='text'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td><input class='form-control' type='number'></td>" +
    "    <td class='edit-delete-col'>" +
    "        <button type='submit' class='btn btn-success btn-xs'>" +
    "            <i class='fa fa-floppy-o fa-fw' aria-hidden='true'></i>" +
    "        </button>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "        <button type='submit' class='btn btn-warning btn-xs'>" +
    "            <i class='fa fa-ban fa-fw' aria-hidden='true'></i>" +
    "        </button>" +
    "    </td>" +
    "</form>" +
    "</tr>";

$(document).ready(function () {
    'use strict';

    $("#indexTable").tablesorter({
        sortList: [[2, 1]]
    });

    $("#showTable").tablesorter({
        sortList: [[0, 0]]
    });

    $("button.edit").on("click", function () {
        console.log("You clicked an edit button!");
    });

    $("button.delete").on("click", function () {
        console.log("delete button!");
    });

    $("button.add-participant").on("click", function () {
        $.ajax({
            url: "/participants/json",
            data: {}, // query criteria, i.e. db.participants.find(data)
            type: "GET",
            dataType: "html"
        }).done(function (response) {
            // success
            console.log("add participant");
            $(newTableRowForm).appendTo("#showTableBody");
            console.log(response);
        }).fail(function (xhr, status, err) {
            alert("Sorry, there was a problem retrieving names from the participants collection!");
            console.log("Error: " + err);
            console.log("Status: " + status);
            console.dir(xhr);
        }).always(function (xhr, status) {
            // intentionally left blank
        });
    });

});

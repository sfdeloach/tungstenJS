'use strict';

var dateTimeHelperObject = {
  /*
     *  When a HTML input date type is received, it is a string in the format of "YYYY-MM-DD".
     *  If this raw string is used to insert into MongoDB, it assumes the time is midnight
     *  UTC. This causes the date to later appear to be one day before the date that was
     *  selected.
     *
     *  For example, a user selects 4/10/2017 in a HTML date input. This is interpreted as
     *  2017-04-10T00:00:00.000Z. When this date is later read from the database and displayed
     *  using a toLocaleDateString() method, it is interpreted as 2017-04-09T18:00:00.000EST
     *
     *  This function takes that string, converts it to a date object, and adjusts the time
     *  to the local timezone so that it can be recorded in the database as the date and time
     *  the user most likely intended.
     *
     *  "2017-04-10T00:00:00.000Z" --> date object --> +timezone offset --> date object midnight local time
     */
  htmlToDb: function(htmlDateString) {
    var dateObject = new Date(htmlDateString),
      timezoneOffsetInMinutes = dateObject.getTimezoneOffset();
    dateObject.setTime(
      dateObject.getTime() + timezoneOffsetInMinutes * 60 * 1000
    );
    return dateObject;
  },
  /*
     *  date object --> "2017-04-10T00:00:00.000Z" --> "2017-04-10"
     */
  dbToHtml: function(dbDateObject) {
    var dbDateString = dbDateObject.toJSON();
    return dbDateString.slice(0, dbDateString.indexOf('T'));
  },
};

module.exports = dateTimeHelperObject;

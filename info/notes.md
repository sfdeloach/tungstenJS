# tungstenJS

A NodeJS deployed wellness app for the [City of Altamonte Springs](http://www.altamonte.org) featuring a MongoDB backend and authentication

### Notes:
* All routes will require an authenticated user (3 levels of auth)
* It is implied the admin route will have access to all routes
* All users are pre-loaded with their email addresses
* Registration/password reset sends an email to their address with a temp password
* Google email account setup, looking to use Nodemailer to send automated messages to users
* A link to the main app page /wellness will be available in the menu bar on all routes
* Lock a worksheet after three months
* Calc (calculations from the participant's assessment)
* Files containing PII have the *.seed extension in order to be ignored by git
* Depending on auth level, a soft delete of data may be the only option available

### Main App Page
* black & white photo full in the background large orange and blue circle divided in half with these two options
* Participants
* Worksheets

## objectives - A journal of sorts

### var num = 0; // MongoDB w/ Mongoose
* completed the schema for db, includes four collections: users, participants, assessments, and worksheets
* created seed data for participants and assessments
* confirmed using a participant schema type in the assessment schema freezes the data
* decided a static embed instead of a dynamic embed in this situation is preferred so name changes can be preserved
* learned a unique object id is created for the embeded participant data and it does not match it's parent object id in the participant collection
* decided to make the dept_id key in participant unique, this will be the query key when trying to find all assessments for one participant, POSSIBLE ISSUE: this will essentially become a required field and may provide complications for other groups such as applicants and city employees...if this field is left blank, it will create more than one null field and will fail upon insertion since duplicate values exist, SOLUTION: validate data where a three digit number is required for pd, all others will auto generate a dept_id based on the time it was created (i.e. Math.floor(new Date().getTime()/1000))
* learned when using passport, there must be a 'username' key in your Users schema
* completed seeds.js which does not require mongoose and populates and associates all four collections, there was an issue using the save() method where duplicate object ids were pushed to the array
* configured passport, passwords are hashed and stored in database
* abandoned seeds file due to a change in collection schema, assessments are now embedded in worksheets as an array, as such the assessment file has been deleted
*
* TODO: convert all csv data from old wellness to json, setup in a tables directory
*       develop an interpolate function and logic that calculates results

### var num = 1; // Express
* setup routes
* began setup of worksheet routes (index and show)
* created a dump of the tungsten database, will track via git until routes are better developed

### var num = 2; // jQuery & Nunjucks
* figure out the logic

### var num = 3; // Bootstrap
* make it pretty

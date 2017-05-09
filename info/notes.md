# tungstenJS

A NodeJS deployed wellness app for the [City of Altamonte Springs](http://www.altamonte.org) featuring a MongoDB backend and authentication

### Notes:
* All routes will require an authenticated user (3 levels of auth)
* It is implied the admin route will have access to all routes
* New users are created by an admin user, a temporary email can be sent via the login page by clicking the 'Forgot password?' button
* Password recovery sends an email to the user's address with a temp password, once logged on they are prompted to change it
* Auto generated emails are send from 'altamonte.springs.channel.14@gmail.com'
* A link to the main page will be available in the top left menu bar on all routes, unless blocked by authentication, then user is redirected to /login
* Files containing PII have the *.seed extension in order to be ignored by git

### Main App Page
* black & white photo full in the background large buttons visible based on user's level of access
* Participants
* Worksheets
* Users
* Database (read-only access to the complete contents of the database, password hash and salt are not visible)

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
* converted all csv data from old wellness to json, setup in a public facing script
* developed an interpolate function and logic that calculates results, all calculations are handled client-side

### var num = 1; // Express
* routes setup
* users
* worksheets
* participants
* database

### var num = 2; // jQuery & Nunjucks
* jQuery and Nunjucks used to create and manipulate pages

### var num = 3; // Bootstrap
* abandoned foundation for bootstrap

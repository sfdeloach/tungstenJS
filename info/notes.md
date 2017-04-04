# tungstenJS

A NodeJS deployed wellness app for the [City of Altamonte Springs](http://www.altamonte.org) featuring a MongoDB backend and authentication

### Notes:
* All routes will require an authenticated user (3 levels of auth)
* It is implied the admin route will have access to all routes
* All users are pre-loaded with their email addresses
* Registration/password reset sends an email to their address with a temp password
* A link to the main app page /wellness will be available in the menu bar on all routes
* Lock a worksheet after three months
* Calc (calculations from the participant's assessment)
* Files containing PII have the *.seed extension in order to be ignored by git
* Depending on auth level, a soft delete of data may be the only option available

### Main App Page
a black & white photo full in the background large orange and blue circle divided in half with these two options
* Participants
* Worksheets

## objectives - A journal of sorts

### var num = 0; // MongoDB w/ Mongoose
* completed the schema for db, includes four collections: users, participants, assessments, and worksheets
* created seed data for participants and assessments
* confirmed using a participant schema type in the assessment schema freezes the data
* decided a static embed instead of a dynamic embed in this situation is preferred so name changes can be preserved
* learned a unique object id is created for the embeded participant data and it does not match it's parent object id in the participant collection
* decided to make the dept_id key in participant unique, this will be the query key when trying to find all assessments for one participant
* learned when using passport, there must be a 'username' key in your Users schema
* completed seeds.js which does not require mongoose and populates and associates all four collections, there was an issue using the save() method where duplicate object ids were pushed to the array
*
* NEXT: is there a way for passport to encrypt the passwords as they are stored in the db?
* NEXT: can we drop mongoose altogether?

### var num = 1; // Express
* setup routes

### var num = 2; // jQuery & Nunjucks
* figure out the logic

### var num = 3; // Foundation
* make it pretty

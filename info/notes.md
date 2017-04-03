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

### Main App Page
a black & white photo full in the background large orange and blue circle divided in half with these two options
* Participants
* Worksheets

## objectives

### var num = 0;
* complete the schema for db
* create seed data and test
* run this test to validate the choice to use participantSchema in the assessmentSchema as opposed to an object ID
 * Create a participant and place into an assessment
 * Update the participants name and place into a new assessment
 * Are the participants names differnt or the same? Compare _id's as well
 * Use case for an officer who gets married and changes their name

### var num = 1;
* create and test routes
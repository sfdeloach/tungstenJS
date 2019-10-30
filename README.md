# tungstenJS

- ver 1.0.0 - 05-17-2017 (initial release)
- ver 1.0.1 - 05-26-2017 (bug fix)
- ver 1.0.2 - 05-27-2017 (city certificate feature add)
- ver 1.0.3 - 05-30-2017 (certificate bug fix)
- ver 1.0.4 - 06-16-2017 (security feature added)
- ver 1.0.5 - 07-14-2017 (security feature added)
- ver 1.1.0 - 09-03-2018 (now compatible w/ MongoDB 3.6)
- ver 1.1.1 - 10-28-2018 (security feature added)
- ver 1.1.2 - 11-01-2018 (day off certificate update)
- ver 1.1.3 - 11-03-2018 (session cookie update)
- ver 1.1.4 - 01-05-2019 (upgrade to heroku-18, successful migration to MongoDB Atlas)
- ver 1.1.5 - 07-01-2019 (wellness certificate redesign)
- ver 1.1.6 - 10-30-2019 (wellness certificate redesign - police only)

A NodeJS deployed wellness app for the [City of Altamonte Springs](http://www.altamonte.org)
featuring a MongoDB backend and authentication

- See info/notes.md for specifications, ideas, and objectives
- See info/routes.md for routing tables including required authorization

Environment variables that need to be set:

- SENDGRID_USER, sendgrid username
- SENDGRID_PASS, sendgrid password
- DATABASE_URL, URL to the database
- PORT, server port number
- SESSION_SECRET, session secret

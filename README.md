# tungstenJS

A NodeJS deployed wellness app for the [City of Altamonte Springs](http://www.altamonte.org) featuring a MongoDB backend and authentication

* See info/notes.md for specifications, ideas, and objectives
* See info/routes.md for routing tables including required authorization

Environment variables that need to be set:

* SENDGRID_USER, The sendgrid username
* SENDGRID_PASS, The sendgrid password
* DATABASE_URL, URL to the database including password
* PORT, port number the app is listening on
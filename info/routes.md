# TungstenJS - Routes and Schemas

A sincere thank you to [TablesGenerator.com](http://www.tablesgenerator.com/markdown_tables) for their awesome table-maker tool--it really helped me sort my mess of thoughts out!

### AJAX Routing

| route                          | action | auth   | description                                |
| ------------------------------ | ------ | ------ | ------------------------------------------ |
| /ajax/participants/get_ids     | GET    | editor | returns all pd dept_id's as an array       |
| /ajax/participants/id_exists   | POST   | editor | returns true if a valid dept_id is entered |
| /ajax/worksheets/:worksheet_id | PUT    | editor | updates an assessment within a worksheet   |

### Index Routing

| route                 | action | auth                      | description                              |
| --------------------- | ------ | ------------------------- | ---------------------------------------- |
| /                     | GET    | viewer                    | main page                                |
| /login                | GET    | no authorization required | login form                               |
| /login                | POST   | no authorization required | login verification                       |
| /password_reset_check | GET    | viewer                    | routes user to reset password if flagged |
| /password_reset       | GET    | viewer                    | reset password form                      |
| /password_reset       | PUT    | viewer                    | password hashed and saved in db          |
| /recovery             | GET    | no authorization required | recovery form                            |
| /recovery             | POST   | no authorization required | recovery email sent via sendgrid         |
| /logout               | GET    | no authorization required | logout and redirect to login             |

### JSON Routing

| route              | action | auth  | description                 |
| ------------------ | ------ | ----- | --------------------------- |
| /json              | GET    | admin | index of db views           |
| /json/participants | GET    | admin | participant json result set |
| /json/users        | GET    | admin | user json result set        |
| /json/worksheets   | GET    | admin | worksheet json result set   |

### Participants Routing

| route                 | action | auth   | description                 |
| --------------------- | ------ | ------ | --------------------------- |
| /particpants          | GET    | editor | index of participants       |
| /particpants/new      | GET    | editor | new participant form        |
| /particpants          | POST   | editor | new participant saved to db |
| /particpants/:id/edit | GET    | editor | edit form                   |
| /particpants/:id      | PUT    | editor | save update                 |
| /particpants/:id      | DELETE | editor | delete participant          |

### Users Routing

| route           | action | auth  | description          |
| --------------- | ------ | ----- | -------------------- |
| /users          | GET    | admin | index of users       |
| /users/new      | GET    | admin | new user form        |
| /users          | POST   | admin | new user saved to db |
| /users/:id/edit | GET    | admin | edit form            |
| /users/:id      | PUT    | admin | save update          |
| /users/:id      | DELETE | admin | delete user          |

### Worksheets Routing

| route                                    | action | auth   | description                                |
| ---------------------------------------- | ------ | ------ | ------------------------------------------ |
| /worksheets                              | GET    | editor | index of worksheets                        |
| /worksheets/new                          | GET    | editor | new worksheet form                         |
| /worksheets                              | POST   | editor | new worksheet saved to db                  |
| /worksheets/:worksheet_id                | GET    | viewer | view a worksheet with editable assessments |
| /worksheets/:worksheet_id                | POST   | editor | edit worksheet title and description       |
| /worksheets/:worksheet_id/calc           | GET    | viewer | view assessment results                    |
| /worksheets/:worksheet_id/certificates   | GET    | editor | certificate form                           |
| /worksheets/:worksheet_id/certificates   | POST   | editor | certificates printed to screen             |
| /worksheets/:worksheet_id/:assessment_id | DELETE | editor | delete an assessment                       |
| /worksheets/:id                          | DELETE | editor | delete worksheet                           |

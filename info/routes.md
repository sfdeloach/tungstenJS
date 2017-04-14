# TungstenJS - Routes and Schemas

A sincere thank you to [TablesGenerator.com](http://www.tablesgenerator.com/markdown_tables) for their awesome table-maker tool--it really helped me sort my mess of thoughts out!

### Participant Routing

TODO!

### Worksheet Routing

| name    | url                     | action | description                                   | auth | functions                               |
|---------|-------------------------|--------|-----------------------------------------------|------|-----------------------------------------|
| index   | /worksheets             | GET    | Displays all active and inactive worksheets   | A    | new, show, destroy, active, remove      |
| new     | /worksheets/new         | GET    | Displays a page to create a new worksheet     | AE   | create, active                          |
| create  | /worksheets             | POST   | Creates a new worksheet document in the db    | AE   | active                                  |
| show    | /worksheets/:id         | GET    | Show assessments in the given worksheet*      | AEV  | edit, results, certify, archive, delete |
| edit    | /worksheets/:id/edit    | GET    | Edit the assessments in the given worksheet** | A(E) | assessment{add,edit,remove}, update     |
| update  | /worksheets/:id         | PUT    | Updates the given worksheet                   | AE   | --> show                                |
| destroy | /worksheets/:id         | DELETE | Deletes the given worksheet permanently       | A    | --> active                              |
| active  | /worksheets/active      | GET    | Displays only active worksheets               | AEV  | new, show                               |
| calc    | /worksheets/:id/calc    | GET    | Produces a printable results table            | AEV  | active                                  |
| remove  | /worksheets/:id/remove  | PUT    | Soft delete of the worksheet                  | AE   | --> active                              |
| certify | /worksheets/:id/certify | PUT    | Disallows editing of the worksheet            | AE   | --> active                              |

    *  SHOW route will perform a check to see if it is time to lock the worksheet
    ** EDIT route disabled by the CERTIFY route

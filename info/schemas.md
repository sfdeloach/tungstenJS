# TungstenJS - Schemas based on mongoose

### Partipants Schema (docs created via the participants routes)
```javascript
var participantSchema = new mongoose.Schema({
    name: {
        first: { type: String, lowercase: true },
        last: { type: String, lowercase: true }
    },
    dept_id: { type: String, trim: true },
    dob: Date,
    sex: { type: String, enum: ["m", "f"] },
    group: { type: String, enum: ["applicant", "pd", "city", "test", "other"] }
});
```
### Assessment Schema (docs created via the worksheet routes)
```javascript
var assessmentSchema = new mongoose.Schema({
    is_active: Timestamp, // active if null, inactivated on the date entered if !null
    created: Timestamp,
    participant: participantSchema, // note it is not an objectId
    worksheet: mongoose.Schema.ObjectId,
    eval_date: Date,
    weight: { type: Number, min: 0 },
    heart_rate: { type: String, trim: true },
    blood_pressure: { type: String, trim: true }    ,
    body_fat: { type: Number, min: 0 },
    flex: { type: Number, min: 0 },
    situp: { type: Number, min: 0 },
    bench: { type: Number, min: 0 },
    press: { type: Number, min: 0 },
    cardio: {
        type: { type: String, enum: ["walk", "run"] },
        time: { type: Number, min: 0 }, // in seconds
        heart_rate: { type: Number, min: 0 }
    }
});
```
### Worksheet Schema
```javascript
var worksheetSchema = new mongoose.Schema({
    is_active: Timestamp, // active if null, inactivated on the date entered if !null
    created: Timestamp,
    is_locked: Timestamp, // unlocked if null, locked on the date entered if !null
    title: String,
    author: mongoose.Schema.ObjectId, // from user schema
    assessments: [mongoose.Schema.ObjectId]
});
```
### User Schema
```javascript
var userSchema = new mongoose.Schema({
    name: {
        first: { type: String, lowercase: true },
        last: { type: String, lowercase: true }
    },
    email: { type: String, lowercase: true },
    password: String,
    needs_reset: Boolean, // if true, user redirected to create a new password, otherwise normal login occurs
    auth_level: { type: String, enum: ["admin", "editor", "viewer"] }
});
```
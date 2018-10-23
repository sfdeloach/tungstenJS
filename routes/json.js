'use strict';

var express = require('express'),
  router = express.Router(),
  Participant = require('../models/participant'),
  User = require('../models/user'),
  Worksheet = require('../models/worksheet'),
  authorization = require('../helpers/authorization.js');

router.get('/', authorization.isAdmin, function(req, res) {
  res.render('json/index.njk');
});

router.get('/participants', authorization.isAdmin, function(req, res) {
  Participant.find({}, function(err, foundParticipants) {
    res.send(foundParticipants);
  });
});

router.get('/users', authorization.isAdmin, function(req, res) {
  User.find({}, function(err, foundUsers) {
    res.send(foundUsers);
  });
});

router.get('/worksheets', authorization.isAdmin, function(req, res) {
  Worksheet.find({}, function(err, foundWorksheets) {
    res.send(foundWorksheets);
  });
});

module.exports = router;

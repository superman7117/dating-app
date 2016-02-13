'use strict';

var express = require('express');
var router = express.Router();

/* GET frontend app. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Angular' });
});

module.exports = router;

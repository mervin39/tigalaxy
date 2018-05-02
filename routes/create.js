var express = require('express');
var router = express.Router();

/* GET /render. */
router.get('/', function(req, res, next) {
  res.send('create a galaxy')
});

module.exports = router;

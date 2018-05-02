var express = require('express');
var router = express.Router();

/* GET /render. */
router.get('/', function(req, res, next) {
  res.render('pages/create.ejs')
});

module.exports = router;

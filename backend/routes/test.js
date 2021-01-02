var express = require('express');
var router = express.Router();

/* test home page. */
router.post('/', function(req, res, next) {
  res.send('1');
});

module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/:name', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/img/'+req.params.name));
});

module.exports = router;

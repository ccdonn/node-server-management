var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


router.get('/header.css', function(req, res){
  res.sendFile(path.join(__dirname+'/public/css/header.css'));
});


module.exports = router;

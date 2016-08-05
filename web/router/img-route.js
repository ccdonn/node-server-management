var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/:name', function(req, res){
  if (req.params.name.endsWith('.jpg')||req.params.name.endsWith('.png')||req.params.name.endsWith('.gif')) {
    res.sendFile(path.join(__dirname+'/../public/img/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;

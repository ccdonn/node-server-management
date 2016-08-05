var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/css/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/embed/css/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/css/fa/css/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/embed/css/fa/css/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/css/fa/fonts/:name', function(req, res){
  if (req.params.name.endsWith('.svg')||req.params.name.endsWith('.ttf')||req.params.name.endsWith('.woff')) {
    res.sendFile(path.join(__dirname+'/../public/embed/css/fa/fonts/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;

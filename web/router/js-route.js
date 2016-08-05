var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* Sample, DO NOT Release this function */
// router.get('/:filename', function(req, res){
//   var filename = req.params.filename;
//   res.sendFile(path.join(__dirname+'/public/js/'+filename));
// });


router.get('/jquery/jquery.min.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/jquery-1.12.0.min.js'));
});

router.get('/jquery/jquery.cookie.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/jquery.cookie-1.4.1.js'));
});

router.get('/jquery/jquery.colorbox-min.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/jquery.colorbox-1.6.4-min.js'));
});

router.get('/jquery/jquery.lazyload.min.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/jquery.lazyload-1.9.1-min.js'));
});

router.get('/jquery/jquery-ui.min.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/jquery-ui-1-11-4.min.js'));
});

router.get('/jquery/url.min.js', function(req, res){
  res.sendFile(path.join(__dirname+'/../public/js/jquery/url.min.js'));
});

router.get('/:name', function(req, res){
  if (req.params.name.endsWith('.js')) {
    res.sendFile(path.join(__dirname+'/../public/js/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/feed/:name', function(req, res){
  if (req.params.name.endsWith('.js')) {
    res.sendFile(path.join(__dirname+'/../public/js/feed/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/profile/:name', function(req, res){
  if (req.params.name.endsWith('.js')) {
    res.sendFile(path.join(__dirname+'/../public/js/profile/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;

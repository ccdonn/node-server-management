var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* Sample, DO NOT Release this function */
// router.get('/:filename', function(req, res){
//   var filename = req.params.filename;
//   res.sendFile(path.join(__dirname+'/public/js/'+filename));
// });

router.get('/common.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/common.js'));
});

router.get('/welcome.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/welcome.js'));
});

router.get('/login.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/login.js'));
});

router.get('/resetPass.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/resetPass.js'));
});

router.get('/forgetPass.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/forgetPass.js'));
});

router.get('/firstLogin.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/firstLogin.js'));
});

router.get('/feed.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/feed.js'));
});

router.get('/index.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/index.js'));
});

router.get('/feed_category.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/feed/category.js'));
});

router.get('/feed/provider.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/feed/provider.js'));
});

router.get('/user.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/user.js'));
});

router.get('/user/passwd.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/js/user/passwd.js'));
});

module.exports = router;

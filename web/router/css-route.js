var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


// router.get('/header.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/header.css'));
// });
//
// router.get('/feed/provider.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/feed/provider.css'));
// });
//
// router.get('/feed/category.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/feed/category.css'));
// });
//
// router.get('/feed/FeedManagement.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/feed/FeedManagement.css'));
// });
//
// router.get('/feed/addprovidersand.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/feed/addprovidersand.css'));
// });
//
// router.get('/feed/addcategory.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/feed/addcategory.css'));
// });
//
// router.get('/onoffswitch.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/onoffswitch.css'));
// });
//
// router.get('/colorbox.css', function(req, res){
//   res.sendFile(path.join(__dirname+'/../public/css/colorbox.css'));
// });

router.get('/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/feed/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/feed/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/profile/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/profile/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;

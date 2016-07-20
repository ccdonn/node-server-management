
var express = require('express');
var webRoutes = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var cookieParser = require('cookie-parser');
var request = require('request');

var superSecret = config.secret;

webRoutes.use(cookieParser());
/* Web route */
/* Open Section */

webRoutes.get('/resetPass', function(req, res){
  console.info('forget and reset password page');
  res.render('resetPass');
})

// Link to '${endpoint}/web/login.html
webRoutes.get('/login', function(req, res){
  console.info('login page');
  res.render('login');
});

// Link to '${endpoint}/web/welcome
webRoutes.get('/welcome', function(req, res){
  console.info('welcome page');
  res.render('welcome');
});

// Link to '${endpoint}/web/forgetPasswd
webRoutes.get('/forgetPass', function(req, res){
  console.info('forgetPass page');
  res.render('forgetPass');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/firstLogin', function(req, res){
  console.info('firstLogin page');
  res.render('firstLogin');
});

/* Restrict Section */
webRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.zmgrToken;

  // console.info('verify webRoutes:'+token);
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        // return res.json({ success: false, message: 'Failed to authenticate token.' });
        console.warn('WEB:Failed to authenticate token');
        return res.status(301).redirect('/web/login');
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    // return res.status(301).json({ success: false, message: 'No token provided.' });
    console.warn('WEB:No token provided');
    return res.status(301).redirect('/web/login');

  }
});


// Link to '${endpoint}/web/firstLogin
webRoutes.get('/index', function(req, res){
  console.info('index page');
  res.render('index');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/feed', function(req, res){
  console.info('feed page');
  console.info(req.cookies.zmgrToken);
  var options = {
    url: 'http://localhost:3002/api/getFeed',
    headers: {
    'x-access-token': req.cookies.zmgrToken
    }
  };
  request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
})
  res.render('feed');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/feed/category', function(req, res){
  console.info('feed category page');
  res.render('feed/category');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/feed/provider', function(req, res){
  console.info('feed provider page');
  res.render('feed/provider');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/user', function(req, res){
  console.info('user page');
  res.render('user');
});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/user/passwd', function(req, res){
  console.info('user passwd page');
  res.render('user/passwd');
});

module.exports = webRoutes;


var express = require('express');
var webRoutes = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./../config');
var cookieParser = require('cookie-parser');
var request = require('request');

const superSecret = config.secret;
const iapiHost = config.iapiHost;
const iapiPort = config.iapiPort;

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
webRoutes.get('/feed/FeedManagement', function(req, res){
  console.info('feed page');
  var p=1, ps=10;
  if (req.query.p) {
    p = req.query.p;
  }
  if (req.query.ps) {
    ps = req.query.ps;
  }
  var offset = ps*(p-1);
  var opt = req.query.opt;

  var url1_opt = (opt)?'?opt>-1':'?opt='+opt;
  var url2_opt = '?p='+p+'&ps='+ps+'&offset='+offset;
  url2_opt += (opt)?'&opt='+opt:'';

  var options1 = {
    url: 'http://'+iapiHost+':'+iapiPort+'/api/getFeedCnt'+url1_opt,
    headers: {
      'x-access-token': req.cookies.zmgrToken
    }
  };

  var hit = 0;
  request(options1, function(error, response, body1){
    if (!error && response.statusCode == 200) {
      body1 = JSON.parse(body1);
      hit = body1[0].cnt;
      // console.info(url2_opt);
      var options2 = {
        url: 'http://'+iapiHost+':'+iapiPort+'/api/getFeed'+url2_opt,
        headers: {
          'x-access-token': req.cookies.zmgrToken
        }
      };

      request(options2, function (error, response, body2) {
        if (!error && response.statusCode == 200) {
          body2 = JSON.parse(body2);
          console.info(body2);
          res.render('feed/FeedManagement', { hit:hit, cntr:body2.data.length, data: body2.data, page:p, pagesize: ps, startNum:(ps*(parseInt(p)-1))+1, endNum:(ps*(parseInt(p)-1))+body2.data.length });
        }
      });

    }
  });


});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/feed/FeedCategoryManagement', function(req, res){
  console.info('feed category page');

  var pagesize = (req.query.ps)?req.query.ps:10;
  var page = (req.query.p)?req.query.p:1;
  var qs = (req.query.qs)?req.query.qs:'';
  var qloc = (req.query.qloc)?req.query.qloc:'JP';
  var qk = (req.query.qk)?req.query.qk:'';

  var url_opt = '?p='+page+'&ps='+pagesize+'&qs='+qs+'&qloc='+qloc+'&qk='+qk;
  // console.info(url_opt);
  var options = {
    url: 'http://'+iapiHost+':'+iapiPort+'/api/feed/category'+url_opt,
    headers: {
      'x-access-token': req.cookies.zmgrToken
    }
  };

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      // console.info(body);
      body = JSON.parse(body);
      res.render('feed/category', body);
    }
  });

});

// Link to '${endpoint}/web/firstLogin
webRoutes.get('/feed/ContentProviderManagement', function(req, res){
  console.info('feed provider page');

  var pagesize = (req.query.ps)?req.query.ps:10;
  var page = (req.query.p)?req.query.p:1;
  var qloc = (req.query.qloc)?req.query.qloc:'';
  var qlang = (req.query.qlang)?req.query.qlang:'';
  var qk = (req.query.qk)?req.query.qk:'';

  url_opt = '?ps='+pagesize+'&p='+page+'&qloc='+qloc+'&qlang='+qlang+'&qk='+qk;
  console.info(url_opt);
  var options = {
    url: 'http://'+iapiHost+':'+iapiPort+'/api/feed/provider'+url_opt,
    headers: {
      'x-access-token': req.cookies.zmgrToken
    }
  };

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      body.page = page;
      body.pagesize = pagesize;
      body.startNum = (pagesize*(parseInt(page)-1))+1;
      body.endNum = (pagesize*(parseInt(page)-1))+body.cntr;
      console.info(body);
      res.render('feed/provider', body);
//      res.render('feed/FeedManagement', { hit:hit, cntr:body2.data.length, data: body2.data, page:p, pagesize: ps, startNum:(ps*(parseInt(p)-1))+1, endNum:(ps*(parseInt(p)-1))+body2.data.length });
    }
  });


});

// Link to '${endpoint}/web/addprovidersand
webRoutes.get('/feed/addprovidersand', function(req, res){
  console.info('feed addprovidersand');
  res.render('feed/addprovidersand')
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

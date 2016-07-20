
var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var superSecret = config.secret;

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    // port
    user: 'root',
    password: '',
    database: 'z-mgr'
  }
});
var knexData = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    // port
    user: 'root',
    password: '',
    database: 'zipdb'
  }
});

var superSecret = config.secret;


apiRoutes.use(bodyParser.urlencoded({extended:false}));
apiRoutes.use(bodyParser.json());
apiRoutes.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

/* API route */

apiRoutes.get('/', function(req, res){
  res.send({time:new Date(), body:"hihihi, api"});
});

// '${endpoint}/api/auth'
apiRoutes.post('/auth', function(req, res){

  console.info('auth page');

  var inputname = req.body.name;
  var inputpass = req.body.pass;

  console.info(inputname);
  console.info(inputpass);

  if (inputname==undefined || inputname=='') {
    res.json({status:'failure', message:'no input'});
  } else {

    knex.column('id', 'name', 'auth').select().from('user')
    .whereNotNull('password')
    .andWhere('name', inputname)
    .andWhere('status', 1)
    .andWhere(knex.raw('password=password(?)', inputpass))
    .then(function(result){
      console.info(result);
      if (result && result.length>0) {
        var token = jwt.sign(result[0], superSecret, {
          expiresIn: '30m'
        });

        // console.info(jwt.decode(token, app.get('superSecret')).exp);

        res.json({
          status: 'OK',
          message: 'enjoy',
          token: token,
          expire: jwt.decode(token, superSecret).exp
        });
      } else {
        console.info('null');
        res.json({status: 'failure', msg: 'no user/wrong pass'});
      }


      console.info("res"+result);

    });
  }
});

// API auth verify function
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  console.info('verify api:'+req.headers['x-access-token']);
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        console.warn('API:Failed to authenticate token');
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    console.warn('API:No token provided');
    // return res.status(403).send({ success: false, message: 'No token provided.' });
    return res.status(301).redirect('/web/login');

  }
});

apiRoutes.get('/getFeedCnt', function(wreq, wres) {

  var opt = wreq.query.opt;


  var queryString = ' Select count(1) as cnt from FEED ';
  if (opt == 0 || opt == 1 || opt == -1) {
    queryString += ' where Status_ID='+opt;
  } else {
    queryString += ' where Status_ID>=0 ';
  }

	knexData.raw(queryString)
  .then(function(data){
    wres.send(JSON.stringify(data[0]));
  }).catch(function(err){
    console.error(err.code);
    throw err;
  })
});


apiRoutes.get('/getFeed', function(wreq, wres) {
  var p = wreq.param('p', 1);
  var ps = wreq.param('ps', 50);
  var offset = ps*(p-1);
  var opt = wreq.query.opt;

  var queryString = 'Select ID,Title,Link,Image_Link,Description,date_format(Published_Date,"%Y-%m-%d %T") as Published_Date,Status_ID from FEED ';
  if (opt==0 || opt == 1 || opt == -1) {
    queryString += ' where Status_ID='+opt;
  } else {
    queryString += ' where Status_ID>=0 ';
  }
  queryString += ' Order by Published_Date desc,Last_Update_Time desc limit '+offset+', '+ps;

  knexData.raw(queryString)
  .then(function(data){
    console.info(data[0]);
    wres.end(JSON.stringify(data[0]));
  }).catch(function(err){
    console.error(err.code);
    throw err;
  });

});


module.exports = apiRoutes;

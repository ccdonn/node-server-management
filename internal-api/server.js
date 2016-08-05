var express = require('express');
var app = express();
var cors = require('express-cors');
var config = require('./config');
var api = require('./router/api-route');
var port = config.iapiPort;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', api);

app.listen(port);

app.get('/', function(req, res){
  res.send({time:new Date(), body:'It works!'});
});

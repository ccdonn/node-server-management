var express = require('express');
var app = express();
var cors = require('express-cors');
var bodyParser = require('body-parser');
var config = require('./config');

var web = require('./web-route');
var pubcss = require('./css-route');
var pubjs = require('./js-route');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'jade');
app.use('/web', web);
app.use('/css', pubcss);
app.use('/js', pubjs);

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
var port = process.env.PORT || 3005;

app.listen(port);
console.log('Magic Server Start, Listen on:' + port);

app.get('/', function(req, res){
  res.render('index', {title:'', body:'It works!'});
});

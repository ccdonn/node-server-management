
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
    password: config.sqlPass,
    database: 'z-mgr'
  }
});
var knexData = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    // port
    user: 'root',
    password: config.sqlPass,
    database: 'zipdb'
  }
});
var redis = require('redis'),
    RDS_PORT = 6379,
    RDS_HOST = '127.0.0.1',
    RDS_PWD = config.redisPass,
    RDS_OPTS = {auth_pass:RDS_PWD},
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

client.on('ready', function(res){
  console.info('redis ready');
});


apiRoutes.use(bodyParser.urlencoded({extended:false}));
apiRoutes.use(bodyParser.json());
apiRoutes.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

/* API route */
apiRoutes.options('/feed/announce', function(wreq, wres) {
  wres.sendStatus(200);
});


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
  var ps = wreq.param('ps', 10);
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
    var resObj = {
      data: data[0]
    };
    wres.send(resObj);
  }).catch(function(err){
    console.error(err.code);
    throw err;
  });

});

apiRoutes.put('/feed/announce', function(req, res){

  // console.info('announce');
  var id = req.query.id;
  var statusid = req.body.s;

  if (id.length==36) {
    var queryString = 'update FEED set Last_Update_Time=now(), Status_ID='+statusid+' where id="'+id+'"';
    knexData.raw(queryString)
      .then(function(data){
        queryString = 'Select f.ID Id,f.Title title,f.Link link,f.Image_Link imageLink,f.Description description,UNIX_TIMESTAMP(Published_Date)*1000 as publishedDate,f.Status_ID statusId,"update" as op,fs.Name mediaName, fs.Lang lang, fs.Loc loc, fs.Duration duration from FEED f join FEED_SEED fs on f.Seed_ID=fs.ID where fs.Status_ID=1 and f.ID="'+id+'"';
        knexData.raw(queryString)
          .then(function(data){
            console.info(JSON.stringify(data[0][0]));
            client.lpush('fed-index', JSON.stringify(data[0][0]));
          }).catch(function(err){
            throw err;
          });
        }).catch(function(err){
          throw err;
        });
  }
  res.end();
});

apiRoutes.get('/feed/provider', function(req, res){
  console.info('/feed/provider');

  knexData.select('fs.ID as id', 'fs.Url as url', 'fs.Name as name', 'fs.Loc as loc', 'fs.Lang as lang',
        'fs.Status_ID as status', 'fs.Duration as ttl', 'fs.Auto_Announce as autoAnnounce')
  .from('feed_seed as fs')
  .where('Status_ID', 1)
  .then(function(result){
    res.send({"time": new Date(), "cntr":result.length, "hit":result.length , "data": result});
  }).catch(function(err){
    console.info(err.code);
  });
  // res.send();
});

apiRoutes.get('/feed/category', function(req, res){
  console.info('/feed/category');
  var pagesize = (req.query.ps)?req.query.ps:10;
  var page = (req.query.p)?req.query.p:1;
  var qs = (req.query.qs)?req.query.qs:'';
  var qloc = (req.query.qloc)?req.query.qloc:'';
  var qk = (req.query.qk)?req.query.qk:'';

  knexData.select('fc.ID as id', 'fc.MType as mType', 'fc.Last_Update_Time as lastUpdateTime',
  'fc.Editor as editor', 'fc.Country as loc', 'fc.Status_ID as status',
  'fce1.Value as displayValue', 'fce1.Lang as displayValueLang',
  'fce2.Value as searchValue', 'fce2.Lang as searchValueLang', 'fc.Sort as sort')
  .from('feed_category as fc')
  .join('feed_category_expression as fce1', function(){
    this.on(function(){
      this.on('fce1.ID', 'fc.ID');
      this.andOn('fce1.Type', 1)
    })
  })
  .join('feed_category_expression as fce2', function(){
    this.on(function(){
      this.on('fce2.ID', 'fc.ID');
      this.andOn('fce2.Type', 2);
      this.andOn('fce2.Lang', 'fce1.Lang');
    })
  })
  .where(function(){
    if (qs) {
      this.where('fc.Status_ID', qs);
    } else {
      this.where('fc.Status_ID', '>', -1);
    }
  })
  .where(function(){
    if (qloc) {
      this.where('fc.Country', qloc);
    }
  })
  .orderBy('fc.Sort')
  .then(function(result){
    var resMap = {};
    result.forEach(function(entry){
      if (resMap[entry.id]) {
        var data = {
          "id": entry.id,
          "mType": entry.mType,
          "loc": entry.loc,
          "status": entry.status,
          "editor": entry.editor,
          "lastUpdateTime": entry.lastUpdateTime,
          "displayValue": entry.displayValue,
          "displayValueLang": entry.displayValueLang,
          "searchValue": entry.searchValue,
          "searchValueLang": entry.searchValueLang,
          "sort": entry.sort
        };
        resMap[entry.id].push(data);
      } else {
        resMap[entry.id] = [];
        var data = {
          "id": entry.id,
          "mType": entry.mType,
          "loc": entry.loc,
          "status": entry.status,
          "editor": entry.editor,
          "lastUpdateTime": entry.lastUpdateTime,
          "displayValue": entry.displayValue,
          "displayValueLang": entry.displayValueLang,
          "searchValue": entry.searchValue,
          "searchValueLang": entry.searchValueLang,
          "sort": entry.sort
        };
        resMap[entry.id].push(data);
      }
    });

    // console.info(resMap);

    var resList = Object.keys(resMap).map(function(key){
      var item = {};
      resMap[key].forEach(function(entry){
        if (item.id) {
        } else {
          item.id = entry.id;
        }

        if (item.status) {
        } else {
          item.status = entry.status;
        }

        if (item.mType) {
        } else {
          item.mType = entry.mType;
        }

        if (item.loc) {
        } else {
          item.loc = entry.loc;
        }

        if (item.editor) {
        } else {
          item.editor = entry.editor;
        }

        if (item.lastUpdateTime) {
        } else {
          item.lastUpdateTime = entry.lastUpdateTime;
        }

        if (item.displayValue) {
        } else {
          item.displayValue = {};
        }

        if (item.searchValue) {
        } else {
          item.searchValue = {};
        }

        if (item.sort) {
        } else {
          item.sort = entry.sort;
        }

        item.displayValue[entry.displayValueLang] = entry.displayValue;
        item.searchValue[entry.searchValueLang] = entry.searchValue;
      });
      return item;
    });

    resList.sort(function(a,b) {return (a.sort > b.sort) ? 1 : ((b.sort > a.sort) ? -1 : 0);})

    if ((resList.length-((page-1)*pagesize))>pagesize) {
      res.send({"time":new Date(), "cntr":pagesize, "hit":resList.length, "data":resList.slice((page-1)*pagesize, ((page-1)*pagesize)+parseInt(pagesize))});
    } else {
      res.send({"time":new Date(), "cntr":resList.length-((page-1)*pagesize), "hit":resList.length, "data":resList.slice((page-1)*pagesize)});
    }
  });


});

module.exports = apiRoutes;

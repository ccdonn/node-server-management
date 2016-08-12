
var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./../config');
const superSecret = config.secret;
const sqlHost = config.sqlHost;
const sqlPort = config.sqlPort;
const sqlUser = config.sqlUser;
const sqlPass = config.sqlPass;
const redisHost = config.redisHost;
const redisPort = config.redisPort;
const redisPass = config.redisPass;

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    password: sqlPass,
    database: 'z-mgr'
  }
});
var knexData = require('knex')({
  client: 'mysql',
  connection: {
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    password: sqlPass,
    database: 'zipdb'
  }
});
var redis = require('redis'),
    RDS_PORT = redisPort,
    RDS_HOST = redisHost,
    RDS_PWD = redisPass,
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
/* preflight */
apiRoutes.options('/feed/announce', function(req, res) {
  res.sendStatus(200);
});
apiRoutes.options('/user/passwd', function(req, res){
  res.sendStatus(200);
});
apiRoutes.options('/feed/category', function(req, res){
  res.sendStatus(200);
});
apiRoutes.options('/feed/provider', function(req, res){
  res.sendStatus(200);
});
apiRoutes.options('/feed/category/resort', function(req, res){
  res.sendStatus(200);
});


apiRoutes.get('/', function(req, res){
  res.send({time:new Date(), body:"hihihi, api"});
});

// '${endpoint}/api/auth'
apiRoutes.post('/auth', function(req, res){

  console.info('auth page');

  var inputname = req.body.name;
  var inputpass = req.body.pass;

  // console.info(inputname);
  // console.info(inputpass);

  if (inputname==undefined || inputname=='') {
    res.json({status:'failure', message:'no input'});
  } else {

    knex.column('id', 'name', 'auth').select().from('user')
    .whereNotNull('password')
    .andWhere('name', inputname)
    .andWhere('status', 1)
    .andWhere(knex.raw('password=password(?)', inputpass))
    .then(function(result){
      // console.info(result);
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

  // console.info('verify api:'+req.headers['x-access-token']);
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

  var queryString = 'Select f.ID,Title,Link,Image_Link,Description,date_format(Published_Date,"%Y-%m-%d %T") as Published_Date,f.Status_ID,fs.Lang,fs.Loc,fs.Name from FEED f '
                  + ' join FEED_SEED fs on f.Seed_ID=fs.ID ';
  if (opt==0 || opt == 1 || opt == -1) {
    queryString += ' where f.Status_ID='+opt;
  } else {
    queryString += ' where f.Status_ID>=0 ';
  }
  queryString += ' Order by Published_Date desc,f.Last_Update_Time desc limit '+offset+', '+ps;

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
        queryString = 'Select f.ID Id,f.Title title,f.Link link,f.Image_Link imageLink,f.Description description,UNIX_TIMESTAMP(Published_Date)*1000 as publishedDate,f.Status_ID statusId,"update" as op,fs.Name mediaName, fs.Lang lang, fs.Loc loc, fs.Duration duration from FEED f join FEED_SEED fs on f.Seed_ID=fs.ID where fs.Status_ID>=0 and f.ID="'+id+'"';
        knexData.raw(queryString)
          .then(function(data){
            // console.info(JSON.stringify(data[0][0]));
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

  var pagesize = (req.query.ps)?req.query.ps:10;
  var page = (req.query.p)?req.query.p:1;
  var qloc = (req.query.qloc)?req.query.qloc:'JP';
  var qlang = (req.query.qlang)?req.query.qlang:'zh-TW';
  var qk = (req.query.qk)?req.query.qk:'';

  knexData.count('fs.ID as hit').from('FEED_SEED as fs')
  .where('Status_ID', '>', -1)
  .where(function(){
    if(qloc) {
      this.andWhere('fs.Loc', qloc);
    }
    if(qlang) {
      this.andWhere('fs.Lang', qlang);
    }
    if (qk) {
      console.info('qk='+qk);
      this.andWhere('fs.Name', 'like', '%'+qk+'%');
    }
  })
  .then(function(result){
    var hit = parseInt(result[0].hit);
    knexData.select('fs.ID as id', 'fs.Url as url', 'fs.Name as name', 'fs.Loc as loc', 'fs.Lang as lang',
          'fs.Status_ID as status', 'fs.Duration as ttl', 'fs.Auto_Announce as autoAnnounce')
    .from('FEED_SEED as fs')
    .where('Status_ID', '>', -1)
    .where(function(){
      if (qloc) {
        this.andWhere('fs.Loc', qloc);
      }
      if (qlang) {
        this.andWhere('fs.Lang', qlang);
      }
      if (qk) {
        console.info('qk='+qk);
        this.andWhere('fs.Name', 'like', '%'+qk+'%');
      }
    })
    .limit(pagesize)
    .offset(pagesize*(page-1))
    .then(function(result){
      res.send({"time": new Date(), "cntr":result.length, "hit":hit , "data": result});
    }).catch(function(err){
      console.info(err.code);
    });
  });

  // res.send();
});

apiRoutes.post('/feed/provider', function(req, res){
  console.info('/feed/proivder');
  var provider = req.body;
  var username = req.decoded.name;
  console.info(req.decoded);
  console.info(req.body);
  /* check input */

  /* insert new provider */
  knexData('FEED_SEED')
  .insert({
      'Url': provider.url,
      'Name': provider.name,
      'Lang': provider.lang,
      'Loc': provider.loc,
      'Duration': provider.duration,
      'Auto_Announce': 0,
      'Status_ID': 0,
      'Last_Update_Time': new Date(),
      'Editor': username
  }).then(function(result){
    if (result) {
      res.send({status: 'success', time:new Date()});
    } else {
      res.send({status: 'failure', time:new Date()});
    }
  }).catch(function(err){
    console.info(err.code);
    res.send({status: 'failure', time:new Date()});
  });


});

apiRoutes.put('/feed/provider', function(req, res){
  console.info('/feed/provider');
  var provider = req.body;
  var username = req.decoded.name;
  /* check input*/
  if (provider.id) {
  } else {
    res.status(400).send();
  }

  /* update db */
  if (provider.id) {
    knexData('FEED_SEED')
    .where('ID', provider.id)
    .update({
      'Url': provider.url,
      'Name': provider.name,
      'Lang': provider.lang,
      'Loc': provider.loc,
      'Duration': provider.duration,
      'Auto_Announce': provider.autoAnnounce,
      'Last_Update_Time': new Date(),
      'Editor': username
    }).then(function(result){
      console.info(result);
      if (result) {
        res.send({status: 'success', time:new Date()});
      } else {
        res.send({status: 'failure', time:new Date()});
      }
    }).catch(function(err){
      console.info(err.code);
      res.send({status: 'failure', time:new Date()});
    });
  }

});

apiRoutes.patch('/feed/provider', function(req, res){
  console.info('/feed/provider');
  var patchprovider = req.body;
  var username = req.decoded.name;
  /* check input */

  /* update db */
  knexData('FEED_SEED')
  .where('ID', patchprovider.id)
  .update({
    'Status_ID': patchprovider.status,
    'Last_Update_Time': new Date(),
    'Editor': username
  }).then(function(result){
    if (result) {
      res.send({status: 'success', time:new Date()});
    } else {
      res.send({status: 'failure', time:new Date()});
    }
    // return true;
  }).catch(function(err){
    console.info(err.code);
    res.send({status: 'failure', time:new Date()});
  });

  // res.send();
});


apiRoutes.get('/feed/category', function(req, res){
  console.info('/feed/category');
  var qs = (req.query.qs)?req.query.qs:'';
  var qloc = (req.query.qloc)?req.query.qloc:'JP';
  var qk = (req.query.qk)?req.query.qk:'';

  knexData.select('fc.ID as id', 'fc.MType as mType', 'fc.Last_Update_Time as lastUpdateTime',
  'fc.Editor as editor', 'fc.Country as loc', 'fc.Status_ID as status',
  'fce1.Value as displayValue', 'fce1.Lang as displayValueLang',
  'fce2.Value as searchValue', 'fce2.Lang as searchValueLang', 'fc.Sort as sort')
  .from('FEED_CATEGORY as fc')
  .join('FEED_CATEGORY_EXPRESSION as fce1', function(){
    this.on(function(){
      this.on('fce1.ID', 'fc.ID');
      this.andOn('fce1.Type', 1)
    })
  })
  .join('FEED_CATEGORY_EXPRESSION as fce2', function(){
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

    res.send({"time":new Date(), "cntr":resList.length, "hit":resList.length, "data":resList});
  });


});

apiRoutes.post('/feed/category', function(req, res){
  console.info('/feed/category');
  var loc = req.body.loc;
  var mType = 1;
  var displayValue = req.body.displayValue;
  var searchValue = req.body.searchValue;

  console.info('loc='+loc);
  console.info('mType='+mType);
  console.info('displayValue='+displayValue);
  console.info('displayValue.keys='+Object.keys(displayValue));

  var newFeedCategory = [];

  var _new_feed_category = {
    'MType': mType,
    'Country': loc,
    'Sort': 99,
    'Status_ID': 0,
    'Last_Update_Time': new Date(),
    'Editor': ''
  };
  newFeedCategory.push(_new_feed_category);

  knexData.batchInsert('FEED_CATEGORY', newFeedCategory)
  .returning('id')
  .then(function(ids){
    var newFeedCategoryExpressionDisplay = [];
    var newFeedCategoryExpressionSearch = [];

    newFeedCategoryExpressionDisplay = Object.keys(displayValue).map(function(key){
      var _new_feed_category_expression = {'ID':ids, 'Type': 1, 'Lang': key, 'Value':displayValue[key] };
      return _new_feed_category_expression;
    });
    newFeedCategoryExpressionSearch = Object.keys(searchValue).map(function(key){
      var _new_feed_category_expression = {'ID':ids, 'Type': 2, 'Lang': key, 'Value':searchValue[key] };
      return _new_feed_category_expression;
    });

    var newFeedCategoryExpression =
       newFeedCategoryExpressionDisplay.concat(newFeedCategoryExpressionSearch);

    // console.info(newFeedCategoryExpression);

    knexData.batchInsert('FEED_CATEGORY_EXPRESSION', newFeedCategoryExpression)
    .then(function(result){
      client.expire('/feed/category', 1);
      res.send({status: 'success', time:new Date()});
    })
    .catch(function(err){
      res.send({status: 'failure', time:new Date()});
    });
  }).catch(function(err){
    res.send({status: 'failure', time:new Date()});
  });

});

apiRoutes.put('/feed/category', function(req, res){
  console.info('/feed/category');
  var id = req.body.id;
  var status = req.body.status;
  var mType = req.body.mType;
  var loc = req.body.loc;
  var displayValue = req.body.displayValue;
  var searchValue = req.body.searchValue;

  /* Error Input */
  if (id && mType && loc) {
  } else {
    res.status(400).send();
  }

  if (id) {
    knexData.transaction(function(trx){
      knexData('FEED_CATEGORY')
      .where('ID', id)
      .transacting(trx)
      .update({
        'MType': mType,
        'Country': loc,
        'Last_Update_Time': new Date()
      })
      .then(function(result) {
        Object.keys(displayValue).map(function(key){
          knexData('FEED_CATEGORY_EXPRESSION')
          .where('ID', id)
          .andWhere('Type', 1)
          .andWhere('Lang', key)
          .update({
            'Value': displayValue[key]
          })
          .then(function(result){
            return true;
          }).catch(function(err){
            console.log(err.code);
          });
        });
        Object.keys(searchValue).map(function(key){
          knexData('FEED_CATEGORY_EXPRESSION')
          .where('ID', id)
          .andWhere('Type', 2)
          .andWhere('Lang', key)
          .update({
            'Value': searchValue[key]
          })
          .then(function(result){
            return true;
          }).catch(function(err){
            console.log(err.code);
          });
        });
      })
      .then(trx.commit)
      .catch(trx.rollback);
    }).then(function(resp) {
      client.expire('/feed/category', 1);
      console.log('Transaction complete.');
    }).catch(function(err) {
      console.error(err);
    });

  }
  res.send();
});

apiRoutes.patch('/feed/category', function(req, res){
  console.info('/feed/category');
  var id = req.body.id;
  var status = req.body.status;
  var token = req.body.token;
  var username = req.decoded.name;

  knexData('FEED_CATEGORY')
  .where('ID', id)
  .update({
    'Status_ID': status,
    'Last_Update_Time': new Date(),
    'Editor': username
  }).then(function(result){
    if (result) {
      client.expire('/feed/category', 1);
      res.send({status: 'success', time:new Date()});
    } else {
      res.send({status: 'failure', time:new Date()});
    }
    // return true;
  }).catch(function(err){
    console.info(err);
    res.send({status: 'failure', time:new Date()});
  })
  // res.send();
});

apiRoutes.patch('/feed/category/resort', function(req, res){
  console.info('/feed/category/resort');
  var sortList = req.body.sortList;
  var username = req.decoded.name;

  try {
    for( var index=0; index<sortList.length; index++) {
      knexData('FEED_CATEGORY')
        .where('ID', sortList[index].id)
        .update({
          Sort: sortList[index].sort,
          Editor: username,
          Last_Update_Time: new Date()
        }).then(function(result){

        }).catch(function(err){
          console.info(err.code);
          throw err;
        });
      // console.info('inloop');
    }

    client.expire('/feed/category', 1);
    // console.info('end');
    res.send({status: 'success', time:new Date()});

  } catch (err) {
    res.send({status: 'failure', time:new Date()});
  }

});

apiRoutes.post('/user/passwd', function(req, res){
  console.info('/user/passwd');
    var cp = req.body.cp;
    var np = req.body.np;
    var rnp = req.body.rnp;
    var token = req.headers['x-access-token'];

    var userId = jwt.decode(token, superSecret).id;

    var queryString = '';
    // Check
    if (cp=='' || np=='' || rnp==''
      || np!=rnp
      || np.length<8 || rnp.length<8) {
      res.send(false);
    } else {
      // MySQL DB update
      knex.raw('update user set password=password(?) where id=? and password=password(?)', [np, userId, cp])
        .then(function(data){
          console.info(data[0].changedRows);
          if (data  && data[0] && data[0].changedRows) {
            if (data[0].changedRows==1) {
              res.send(true);
            } else {
              res.send(false);
            }
          } else {
            res.send(false);
          }
        });
    }

});

module.exports = apiRoutes;

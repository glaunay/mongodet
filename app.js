var express = require('express');
var jsonfile = require('jsonfile')
var mongo = require('./mongo');
var MongoClient = require('mongodb').MongoClient;
var {spawn} = require('child_process')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

const child = spawn('mongod'); // find a way to shut it when out of the program

// Init the database


arg = process.argv;
if (arg.length > 2){
  if (arg[2]=="-init"){
    MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
      if (err) {
        throw err;
      }
      mongo.insertData(db, __dirname+'/'+arg[3]); 
    })
  }
  else if (arg[2]=="-reinit"){
    MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
      if (err) {
        throw err;
      }
      mongo.deleteData(db);
      mongo.insertData(db, __dirname+'/'+arg[3]); // message not on the right order but work actually
    })  	
  }
  else if (arg[2]=="--testfront"){
      return 0;
  }
  /*else if (arg[2]=="--testmongo"){
    var obj = [{ "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"}, { "_id" : "NM", "volume" : 408.9, "color" : [0,255,0], "category" : "maltoside", "composite":"toto"}];
      if (arg[3]=="--insert"){
        MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
          if (err) {
            throw err;
          }
        mongo.insertData(db,obj); 
    }) 
      return 0;
  }}*/
}


//Partie HTML



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html')
})

app.get('/getKeys',function(req, res,next){
	MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
    	if (err) {
    		throw err;
      	}
      	return(mongo.getallkeys(db)).then(function(items){
      			//res.send({"value":mongo.getallkeys(db)});
      			//console.log(items)
      			res.send(items);

      	})
      	})
         
    })


// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use('/script', express.static(__dirname + '/script'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));
app.use('/pic', express.static(__dirname + '/images'));
app.use('/img',express.static(__dirname + '/data/pdb_images'));
app.use('/css', express.static(__dirname + '/style'));
// Operations on the database


app.use('/loadTab',function (req, res, next) {   /// to load the data in the database
  mongo.FindinDet().then(function(items) {
  var test = items;
    //console.log(items.length) 
    res.send({"data":test});
    next();
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

  
});

// intercept json from POST request

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/newDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  var to_insert = req.body;
  to_insert.volume=Number(to_insert.volume,10)
  if (to_insert._id==''){
  	to_insert._id = null
  }
  if (isNaN(to_insert.volume)) {
  		to_insert.volume = null
  }
  if (to_insert.category == ''){
  	to_insert.category = null
  }
  to_insert.color=[Number(to_insert.color[0]),Number(to_insert.color[1]),Number(to_insert.color[2])]
  res.send({"status":mongo.insertDet(db,to_insert)[0],"data":mongo.insertDet(db,to_insert)[1]} )

//mongo.insertDet(db,to_insert)
});
});
app.post('/removeDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  var to_delete = req.body;
  //console.log(to_delete._id);
  mongo.deleteDet(db,to_delete._id);

});
});

app.post('/updateDet',function (req, res) {
	MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
	if (err) {
		throw err;
	}
	var to_update = req.body;
	to_update.volume = Number(to_update.volume)
	to_update.color=[Number(to_update.color[0]),Number(to_update.color[1]),Number(to_update.color[2])]
	if (to_update.MM != ''){
		to_update.MM = Number(to_update.MM)
	}
	if (to_update.CMC != ''){
		to_update.CMC = Number(to_update.CMC)
	}
	if (to_update.Aggregation_number != ''){
		to_update.Aggregation_number = Number(to_update.Aggregation_number)
	}
	
	mongo.modifyDet(db,to_update._id,to_update);
	


});
});
app.post('/removeCol',function(req,res){
	MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
	if (err) {
		throw err;
	}
	var col = req.body.column;
	mongo.deleteCaract(db,col);
	//console.log(col)

});
});

app.post('/modifCol',function(req,res){
	MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
	if (err) {
		throw err;
	}
	var old_col = req.body.old_column;
	var new_col = req.body.new_column;
	mongo.modifyCaract(db,old_col,new_col);
	//console.log(col)

});
});


/*
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/detest', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('det').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});
*/
/*
var test =[];
mongo.FindinDet().then(function(items) {
  test = items;
  console.log(test);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});
*/

//console.log(mongo.FindinDet())
/*process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    console.log(process.getegid())
    process.exit();
});
*/
app.listen(3000, function () {
  console.log('mongodet server listening on port 3000!')
})


module.exports = app;



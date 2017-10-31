var express = require('express');
var jsonfile = require('jsonfile')
//Partie HTML

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

module.exports = app;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html')
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


//Partie BD

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/detest', function(err, db) {
  if (err) {
    throw err;
  }
 
  db.collection('det').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    //console.log(result);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var readJson=function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	console.log(dict.data);
}
readJson(__dirname+"/../det.json")
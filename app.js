var express = require('express');
var jsonfile = require('jsonfile')
var mongo = require('./mongo');
var {spawn} = require('child_process')

const child = spawn('mongod'); // find a way to shut it when out of the program


//Partie HTML

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

module.exports = app;

var readJson=function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	console.log(dict.data);
}

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
//readJson(__dirname+"/data/det.json")
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
app.use('/getHeader',function (req, res, next) {
	res.send("<h1>Detergent Database CRUD Interface</h1>")
	next();
});

app.use('/getTable',function (req, res, next) {
	res.send("<table id='detable' class='cell-border' cellspacing='0' width='100%''>"
		+"<thead> <tr> <th>Category</th> <th>Name</th> <th>Volum</th>"
		+"<th>Color</th><th>complete name</th><th>Molecular formula</th><th>MM</th><th>CMC (mM)</th><th>Aggregation number</th><th>Ref</th><th>PDB file</th><th>detergent image</th><th>SMILES</th></tr></thead> <tfoot> <tr> <th>Category</th>"
		+"<th>Name</th> <th>Volum</th> <th>Color</th> <th>complete name</th><th>Molecular formula</th><th>MM</th><th>CMC (mM)</th><th>Aggregation number</th><th>Ref</th><th>PDB file</th><th>detergent image</th><th>SMILES</th></tr> </tfoot> </table>")
	next();
});

app.use('/loadTab',function (req, res, next) {   /// to load the data in the database
	var donnees = {"data":mongo.FindinDet()};
	console.log(donnees)
	res.send(donnees);
	next();
});

// intercept json from POST request
app.use(bodyParser.urlencoded({
		extended: true
}));
app.use(bodyParser.json());
app.post('/newDet',function (req, res) {
	console.log(req.body)
});

//Partie BD
app.use('/script', express.static(__dirname + '/script'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));

app.use('/getHeader',function (req, res, next) {
	res.send("<h1>Detergent Database CRUD Interface</h1>")
	next();
});

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

/*
mongo.FindinDet().then(function(items) {
  console.info('The promise was fulfilled with items!', items);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

*/
console.log(mongo.FindinDet())

app.listen(3000, function () {
	console.log('mongodet server listening on port 3000!')
})
/*


*/

//HTML part

var babel = require('babel-polyfill');
var express = require('express');
var jsonfile = require('jsonfile');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var fs = require('fs');

module.exports = app;


app.get('/', (req, res) => {
  db.collection('detergents_modif').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {detergents_modif: result})
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





//BD part

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
	if (err) {
	throw err;
	}
 

	//Function to insert JSON file in database 
	var readJson = function(path) {
		var dict = jsonfile.readFileSync(path,'utf8');
		
		for(var i=0; i<dict.data.length; i++){
		var tempo = [];
			
			if((typeof(dict.data[i].category) == 'string') & (dict.data[i].category != 'null') &
			(typeof(dict.data[i].name) == 'string') & (dict.data[i].name != 'null') &
			(typeof(dict.data[i].vol) == 'number') & (dict.data[i].vol != 'null') &
			(typeof(dict.data[i].color) == 'object') & (dict.data[i].color.length == 3) //verif conditions
			){
				if( (dict.data[i].color[0] >= 0) & (dict.data[i].color[0] <= 255) & 
				(dict.data[i].color[1] >= 0) & (dict.data[i].color[1] <= 255) &
				(dict.data[i].color[2] >= 0) & (dict.data[i].color[2] <= 255)
				){
				
					db.collection('det').find({'name':'TDM'}).toArray(function(err, result) {
						if (err) {
						  throw err;
						}	
						console.log(result);
					});
					
				
					/*
					var obj = dict.data[i];
					//console.log(Object.entries(obj)[0]); //['category':'x'] for all detergents
					//console.log(Object.entries(obj)[1][1]); //[x][y], y=0 key and y=1 value
					
					for(var j=0; j<Object.entries(obj).length; j++){
						if(j != Object.entries(obj).length - 1){
							tempo = tempo + Object.entries(obj)[j][0] + ' : ' + Object.entries(obj)[j][1] + ', ';
						}
						else{
							tempo = tempo + Object.entries(obj)[j][0] + ' : ' + Object.entries(obj)[j][1];
						}
						//console.log('Key:', Object.entries(obj)[j][0]);
						//console.log('Value:', Object.entries(obj)[j][1]);
					}
					*/
					
					/*for(var j=0; j<Object.entries(obj).length; j++){
						tempo.push(Object.entries(obj)[j][0]); //[x][y], y=0 key and y=1 value
						tempo.push(Object.entries(obj)[j][1]);
						//console.log('Key:', Object.entries(obj)[j][0]);
						//console.log('Value:', Object.entries(obj)[j][1]);
					} */
					
					//console.log(tempo);
					
					
					//console.log(dict.data[i]);
					//db.collection('det').insert({tempo});
				
				}
				
			}				
		}	
		
	}
	readJson(__dirname+"/det.json")
	
	
	
	//Function to modify JSON file in a new format 
	var Json_old_to_new = function(path) {
		var dict = jsonfile.readFileSync(path,'utf8');
		const write = [];
		
		for(i=0; i<Object.values(dict.data).length; i++){ //for each class
		
			for(j=0; j<Object.values(dict.data)[i].length; j++){ //for each detergent
				const det = Object.values(dict.data)[i][j];
				det.category = Object.keys(dict.data)[i];				
				write.push(det);
			}
		}
		dict.data = write; //replace "data" values
		
		/*jsonfile.writeFile("./test.json", dict, function(err) { //to write in a file
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
		}); */
		
		return dict;
	}
	//Json_old_to_new(__dirname+"/detergents.json")

	
	
	//Function to modify new JSON file in the old format 
	var Json_new_to_old = function(path) {
		var dict = jsonfile.readFileSync(path,'utf8');
		var write = [];
		var category = [];
		var counter = 0;
		var tempo = '';
		
		for(i=0; i<Object.values(dict.data).length; i++){ //for each detergent
			if(category.includes(dict.data[i].category) == false){ //if it's a new detergent class
				category.push(dict.data[i].category);
				delete dict.data[i].category
				write[category[counter]] = [dict.data[i]];
				counter += 1;

			}else{
				for(j=0; j<Object.keys(write).length; j++){
					if(dict.data[i].category == Object.keys(write)[j]){ //else
						tempo = dict.data[i].category;
						delete dict.data[i].category;
						write[tempo].push(dict.data[i]);
					}
				}
			}
		}
		
		dict.data = write; 		
		return dict;
	}
	//Json_new_to_old(__dirname+"/det.json")


	
	
	
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
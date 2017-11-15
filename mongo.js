//HTML part

//var babel = require('babel-polyfill');
var express = require('express');
var jsonfile = require('jsonfile');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var app = express();
var fs = require('fs');

module.exports = app;



//FUNCTIONS


//Function to check conditions
var checkConditions = function(detergent){
	var check = true;
	if(typeof(detergent.category) != 'string' || detergent.category == 'null'){
		check = 'The detergent category must be filled with string type';
		return check;
	}
	if (typeof(detergent._id) != 'string' || detergent.name == 'null'){
		check = 'The detergent name must be filled with string type';
		return check;
	}
	if (typeof(detergent.vol) != 'number' || detergent.vol == 'null'){
		check = 'The detergent volume must be filled with number type';
		return check;
	}
	if (typeof(detergent.color) != 'object' || detergent.color.length != 3) {
		check = 'The detergent color must be a list of 3 values';
		return check;
	}
return check;
}



//Function to normalize colors
var modifyColor = function(detergent){
	if (detergent.color[0] >= 0 && detergent.color[1] >= 0 && detergent.color[2] >= 0  //A VERIFIER 
	&& detergent.color[0] <= 1 && detergent.color[1] <= 1 && detergent.color[2] <= 1){
		detergent.color[0] = detergent.color[0]*255;
		detergent.color[1] = detergent.color[1]*255;
		detergent.color[2] = detergent.color[2]*255;
	}
}

	

//Function to modify JSON file in a new format 
var Json_old_to_new = function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	var write = [];
	
	for(i=0; i<Object.values(dict.data).length; i++){ //for each class
	
		for(j=0; j<Object.values(dict.data)[i].length; j++){ //for each detergent
			var det = Object.values(dict.data)[i][j];
			det.category = Object.keys(dict.data)[i];
			det['_id'] = det['name']; //Rename key 'name' to '_id'
			delete det['name'];
			modifyColor(det); //Normalization of colors
			write.push(det);
		}
	}
	dict.data = write; //replace "data" values
	return dict;
}






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




//Function to insert JSON file in database 
	var insertData = function(path, db) {
		var dict = Json_old_to_new(path);
		var list = [];
		var list2 = []

		for(var i=0; i<dict.data.length; i++){
			var detergent = dict.data[i];
			var check = checkConditions(detergent);

			if(check == true){ //if conditions are check
				db.collection('det').insert(detergent, function(err,result){
					if(err){
						if (err.code == 11000) {
    					var nameDet = err.errmsg.split('"')[1]; //id of the detergent error
    					list.push(nameDet);
    					console.log(nameDet, ': The detergent name must be unique');
    					}
					}
				});
			}

			else{
				list.push(detergent._id);
				console.log(detergent._id, ' : ', checkConditions(detergent));
			}
		}
		console.log('Insertion of detergents is finish !')
	}



//Function for a test
 var test = function test(){
 	var list = [{ "_id" : "OM", "vol" : 391.1, "color" : [0,255,0], "category" : "maltoside"}, { "_id" : "NM", "vol" : 408.9, "color" : [0,255,0], "category" : "maltoside"}];
 	console.log(list);
 	return list;
 }




//MONGODB

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
	if (err) {
	throw err;
	}

	insertData(__dirname+"/data/detergents.json", db); 
	//test();

});




//EXPORT

module.exports = {
	test: test
}



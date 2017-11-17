//HTML part

var babel = require('babel-polyfill');
var express = require('express');
var jsonfile = require('jsonfile');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var app = express();
var fs = require('fs');

module.exports = app;



//FUNCTIONS


//Function to check conditions for insert detergents
var checkConditionsInsert = function(detergent){
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



//Function to check conditions for update detergents
var checkConditionsUpdate = function(key, value){
	var check = true;
	if(key == 'category'){
		if(typeof(value) != 'string' || value == 'null'){
			check = 'The detergent category must be filled with string type';
			return check;
		}
	}
	if(key == 'vol'){
		if (typeof(value) != 'number' || value == 'null'){
			check = 'The detergent volume must be filled with number type';
			return check;
		}
	}
	if(key == 'color'){
		if (typeof(value) != 'object' || value != 3) {
			check = 'The detergent color must be a list of 3 values';
			return check;
		}
	}

	return check;
}


//Function to normalize colors
var modifyColor = function(detergent){
	if (detergent[0] >= 0 && detergent[1] >= 0 && detergent[2] >= 0  //A VERIFIER 
	&& detergent[0] <= 1 && detergent[1] <= 1 && detergent[2] <= 1){
		detergent[0] = detergent[0]*255;
		detergent[1] = detergent[1]*255;
		detergent[2] = detergent[2]*255;
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
			modifyColor(det.color); //Normalization of colors
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
var insertData = function(db, path) {
	var dict = Json_old_to_new(path);

	for(var i=0; i<dict.data.length; i++){
		var detergent = dict.data[i];
		var check = checkConditionsInsert(detergent);

		if(check == true){ //if conditions are check
			db.collection('det').insert(detergent, function(err,result){
				if(err){
					if (err.code == 11000) {
					var nameDet = err.errmsg.split('"')[1]; //id of the detergent error
					console.log(nameDet, ': The detergent name must be unique');
					}
				}
			});
		}

		else{
			console.log(detergent._id, ' : ', checkConditionsInsert(detergent));
		}
	}
	console.log('Insertion of detergents is finish !')
}



//Function to delete a detergent (input : var with the _id of the detergent)
var deleteDet = function(db, idDet){
	db.collection('det').deleteOne({'_id' : idDet}, function(err, result) {
	    if (err){
	    	throw err;
	    }
	    else{
	    	console.log(idDet, ': The detergent has been removed');    
		}
    });
}



//Function to add a new detergent (input : var like { "_id" : "OM", "vol" : 391.1, "color" : [0,255,0], "category" : "maltoside"})
var insertDet = function(db, det){
	modifyColor(det);
	console.log(det);
	check = checkConditionsInsert(det);
	if(check == true){
		db.collection('det').insert(det, function(err,result){
			if(err){
				if (err.code == 11000) {
				console.log('The detergent name must be unique');
				}
			}
			else{
				console.log('The detergent has been added');
			}
		});
	}
}



//Function to modify a detegent (input : id like "OM", key like "categorie" and value1 like "maltoside")
//value2 is the value that replace the first (value1)
var modifyDet = function(db, id, key, value){ //ATTENTION : if key = col, value must to be a list
	check = true
	if(key == '_id'){
		console.log('The name of the detergent can\'t be update')
		check = false;
	}
	else{
		if(key == 'color'){
			modifyColor(value);
		}
		if(key == 'category' || key == 'vol' || key == 'color'){
			check = checkConditionsUpdate(key, value);
		}

		if(check == true){
			db.collection('det').find({'_id' : id}).toArray((err, result) => {
				if(err){
					throw err;
				}
				if(result.length == 1){
					var newval = {};
					newval[key] = value;
					db.collection('det').update({'_id' : id},{$set:newval});	
					console.log('The database has been update');
				}
			})
		}
	}
}



//Function to return all the base
var database = function database(db){
	var collection = db.collection('det');
	return 
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

	//insertData(db, __dirname+"/data/res.json"); 
	//test();
	//deleteDet(db,'DDM');
	//var toto = { "_id" : "TUTU", "vol" : 391.1, "color" : [0,1,0], "category" : "maltoside"};
	//insertDet(db, toto);
	//modifyDet(db, 'OM', 'vol', 419);



});





//EXPORT

/*module.exports = {
	test: test
}*/


//To return the database
module.exports = {
  	FindinDet: function() {
    	return MongoClient.connect('mongodb://localhost:27017/det').then(function(db) {
      		var collection = db.collection('det');
    		return collection.find().toArray();
    	}).then(function(items) {
      		console.log(items);
     		return items;
    	});
  	}
};





//HTML part

var babel = require('babel-polyfill');
var express = require('express');
var jsonfile = require('jsonfile');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var fs = require('fs');

module.exports = app;



//BD part

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
	if (err) {
	throw err;
	}
 

	//Function to check conditions
	var checkConditions = function(detergent){
		var check = true;
		if(typeof(detergent.category) != 'string' || detergent.category == 'null'){
			check = 'The detergent category must be filled with string type';
			return check;
		}
		if (typeof(detergent.name) != 'string' || detergent.name == 'null'){
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
		if (detergent.color[0] < 0 || detergent.color[1] < 0 || detergent.color[2] < 0  //A VERIFIER 
		|| detergent.color[0] > 1 || detergent.color[1] > 1 || detergent.color[2] > 1){
			//detergent.color[0] = detergent.color[0] / 255;
			//detergent.color[1] = detergent.color[1] / 255;
			//detergent.color[2] = detergent.color[2] / 255;
			check = 'La couleur a été normalisée';
			return check;
		}
		
	return check;
	}
	
	
	

	//Fuction to check unique name of detergent
	var queryCollection = function(detergent){
		//var rest = [];
		console.log('name : ', detergent.name);
    	var result = db.collection('det').find({'name' : detergent.name});
		//console.log('result : ', result);
		console.log('type : ', typeof result);
		result.toArray(function(err, res) {
			console.log('typeof : ', typeof res);
			console.log('length res : ', res.length);
            if (err) {
                console.log(err);
            } else {
                //rest.push(res);
				console.log('res : ', res);
				
				if(res.length != 0){
					console.log('true');
				return true; //Exist
			}
			else{
				console.log('false');
				return false;
			}
            }
			//console.log('rest', rest);
			
			
        });	
		
		/*
		console.log('length :', result.length);
		console.log('typeof : ', typeof result);
		

		for(let i = 0; i<result.length; i++){
			console.log('value : ', result[i]);
		};
		*/
    }
	
	
	
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
		
		return dict;
	}
	//Json_old_to_new(__dirname+"/detergents.json")
	
	

	//Function to insert JSON file in database 
	var insertJson = function(path) {
		//var dict = jsonfile.readFileSync(path,'utf8');
		var dict = Json_old_to_new(path);
		console.log(dict.data.length);
		console.log('dict : ', dict);
		for(var i=0; i<dict.data.length; i++){
			var detergent = dict.data[i];
			console.log('detergent :' , detergent);
			console.log('toto', queryCollection(detergent));
			if(checkConditions(detergent) == true){ //if conditions are check
				//rest = [];
				/*queryCollection(dict.data[i], function(){ //Doesn't work for the moment
					//console.log(detergent);
					if (rest == ''){ //if detergent name doesn't exist
						console.log('vide');
						db.collection('det').insert(detergent);
					}
					else{
						console.log('The detergent name must be unique !');
					}				
				});*/
				
				//db.collection('det').insert(detergent);
				console.log(detergent.name, ' : the detergent has been added to the database')
				
			}
			else{
				console.log(detergent.name, ' : ', checkConditions(detergent));
			}
		}	
	}
	insertJson(__dirname+"/data/detergents_test.json"); 
	
	
	
	
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


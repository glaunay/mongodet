//HTML part

var jsonfile = require('jsonfile');
var path = require('path');
var fs = require('fs');

//var backupModule = require('./mongodb_backup.js');
global.backupModule = require('./mongodb_backup.js');
backupModule.backup();


//Function test
var mytest = function(){
	MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
		if (err) {
			throw err;
		}
		//console.log(typeof(db));
		//insertData(db, __dirname+"/data/res.json");
	});
}



//FUNCTIONS


//Function to check conditions for insert detergents
var checkConditionsInsert = function(detergent){
	let check = true;
	if(typeof(detergent.category) != 'string' || detergent.category == 'null'){
		check = 'The detergent category must be filled with string type';
		return check;
	}
	if (typeof(detergent._id) != 'string' || detergent.name == 'null'){
		check = 'The detergent name must be filled with string type';
		return check;
	}
	if (typeof(detergent.volume) != 'number' || detergent.volume == 'null'){
		check = 'The detergent volume must be filled with number type';
		return check;
	}
	if (typeof(detergent.color) != 'object' || detergent.color.length != 3) {
		check = 'The detergent color must be a list of 3 values';
		return check;
	}
return check; //Return true if conditions are met
}



//Function to normalize colors between 0 and 255
var modifyColor = function(detergent){
	if (detergent[0] >= 0 && detergent[1] >= 0 && detergent[2] >= 0
	&& detergent[0] <= 1 && detergent[1] <= 1 && detergent[2] <= 1){
		detergent[0] = detergent[0]*255;
		detergent[1] = detergent[1]*255;
		detergent[2] = detergent[2]*255;
	}
}

	

//Function to modify JSON file in a new format 
var Json_detBelt_mongo = function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	var write = [];

	var values = Object.keys(dict.data).map(function(key) {
    	return dict.data[key];
	});
	
	for(i=0; i<values.length; i++){ //for each class
	
		for(j=0; j<values[i].length; j++){ //for each detergent
			var det = values[i][j];
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
/*var Json_mongo_detBelt = function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	var write = {};
	var category = [];
	var counter = 0;
	var tempo = '';
	

	var values = Object.keys(dict.data).map(function(key) {
    	return dict.data[key];
	});
	
	for(i=0; i<values.length; i++){ //for each detergent
		if(category.includes(dict.data[i].category) == false){ //if it's a new detergent class (1)
			category.push(dict.data[i].category);
			delete dict.data[i].category
			write[category[counter]] = [dict.data[i]];
			counter += 1;
		}
		else{
			for(j=0; j<Object.keys(write).length; j++){
				if(dict.data[i].category == Object.keys(write)[j]){ //else (2)
					tempo = dict.data[i].category;
					delete dict.data[i].category;
					write[tempo].push(dict.data[i]);
				}
			}
		}
	}
	
	dict = {"data":write};
	return dict;
}*/



//Function to insert JSON file in database 
var insertData = function(db, path) {
	var dict = Json_detBelt_mongo(path);

	for(var i=0; i<dict.data.length; i++){ //for each detergent
		var detergent = dict.data[i];
		var check = checkConditionsInsert(detergent);

		if(check == true){ //if conditions are check
			db.collection('det').insert(detergent, function(err,result){
				if(err){
					if (err.code == 11000) { //if _id is not unique
					var nameDet = err.errmsg.split('"')[1]; //id of the detergent error
					console.log(nameDet, ': The detergent name must be unique');
					}
					else{
						throw err;
					}
				}
			});
		}

		else{
			console.log(detergent._id, ' : ', checkConditionsInsert(detergent));
		}
	}
	console.log('Insertion of detergents is finished !')
	backupModule.control_backup(true);
}



//Function to return the database
var FindinDet =  function() { 
	return MongoClient.connect('mongodb://localhost:27017/det').then(function(db) {
  		var collection = db.collection('det');
		return collection.find().toArray();
	}).then(function(items) {
 		return items;
	});
}



//Function to return all keys
var getallkeys = function(){
	var allKeys = {};
	return MongoClient.connect('mongodb://localhost:27017/det').then(function(db) {
		var collection = db.collection('det');
		return collection.find().toArray();
	}).then(function(items) {
		items.forEach(function(doc){Object.keys(doc).forEach(function(key){allKeys[key]='1'})})
		var l_keys =Object.keys(allKeys)
 		return l_keys;
	});
}



//Function to delete the database
var deleteData = function(db){
	db.collection('det').drop(function(err,result){
		if(err){
			throw err;
		}
		else{
			console.log('The database has been deleted');
			backupModule.control_backup(true);
		}
	});
}





//Function to delete a detergent (input : var with the _id of the detergent)
var deleteDet = function(db, idDet){
	db.collection('det').deleteOne({'_id' : idDet}, function(err, result) {
	    if (err){
	    	throw err;
	    }
	    else{
	    	console.log(idDet, ': The detergent has been removed');
	    	backupModule.control_backup(true);
		}
    });
}



//Function to add a new detergent (input : var like { "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"})
var insertDet = function(db, det){
	modifyColor(det);
	console.log(det);
	var check = checkConditionsInsert(det);
	if(check == true){
		db.collection('det').insert(det, function(err,result){
			if(err){
				if (err.code == 11000) {
				console.log('The detergent name must be unique');
				return false;
				}
			}
			else{
				console.log('The detergent has been added');
				backupModule.control_backup(true);
				return true;
			}
		});
	}
}



//Function to modify a detegent (input : id like "OM" and det is the document like { "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"})
var modifyDet = function(db, id, det){
	var check = true
	modifyColor(det.color);
	check = checkConditionsInsert(det);
		
	if(check == true){
		db.collection('det').find({'_id' : id}).toArray((err, result) => {
			if(err){
				throw err;
			}
			if(result.length == 1){
				db.collection('det').update({'_id' : id},{$set: det}, function(err,result){
					if(err){
						throw err;
					}
					else{
						console.log('The detergent ' + id + ' has been updated');
						backupModule.control_backup(true);
					}
				});
			}
		})
	}
	else{
		console.log(check);
	}
	
}



//Function to delete a caracteristic of detergents
var deleteCaract = function(db, caract){
	var todelete = {};
	todelete[caract] = 1;
	db.collection('det').update({}, {$unset: todelete} , {multi: true}, function(err,result){
			if(err){
				throw err;
			}
			else{
				console.log('The caracteristic ' + db + ' has been deleted for all detergents');
				backupModule.control_backup(true);
			}
	});
}



//Function to rename a caracteristic of detergents
var modifyCaract = function(db, caract1, caract2){ //caract1 : name in the database, caract2 : new name
	var rename = {};
	rename[caract1] = caract2;
	db.collection('det').update({}, {$rename: rename}, {multi: true}, function(err,result){
		if(err){
			throw err;
		}
		else{
			console.log('The caracteristic ' + caract1 + ' has been rename ' + caract2);
			backupModule.control_backup(true);
		}
	});
}



//Function for a test
var testFront = function(){
	var list = [{ "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"}, { "_id" : "NM", "volume" : 408.9, "color" : [0,255,0], "category" : "maltoside"}];
	console.log(list);
	return list;
}



//Function that returns a list of all categories of detergents
var detCategory = function(db){
	db.collection('det').distinct("category",(function(err, result){
		if(err){
			throw err;
		}
		else{
			console.log(result);
       		return result;
		}
   }))
}




//MONGODB

var MongoClient = require('mongodb').MongoClient;

//For do some tests
MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
	if (err) {
		throw err;
	}

	//console.log(typeof(db));

	//Insert the 'res.json' file in database
	//insertData(db, __dirname+"/data/res.json");

	//Delete the 'OM' detergent
	//deleteDet(db,'OM');

	//Insert a new detergent
	//var newdet = { "_id" : "TUTU", "volume" : 391.1, "color" : [0,1,0], "category" : "maltoside"};
	//insertDet(db, newdet);

	//Modify the volume of the 'OM' detergent
	//modifyDet(db, 'OM', {"_id" : "OM", "category":"maltosides","volume" : 20,"color" : [0.0, 255.0, 0.0],"complete_name" : "n-Octyl-β-D-Maltopyranoside","Molecular formula" : "C20H38O11","MM" : 454.4,"CMC (mM)" : 19.5,"Aggregation number" : 47,"Ref" : "Anatrace measurement in collaboration with Professor R. M. Garavito (Michigan State University)","PDB file" : "OM.pdb","detergent image" : null,"SMILES" : "CCCCCCCCOC1C(C(C(C(O1)CO)OC2C(C(C(C(O2)CO)O)O)O)O)O"});

	//Delete a caracteristic for all detergent
	//deleteCaract(db, 'color');

	//Rename the 'volume' caracteristic in 'volume'
	//modifyCaract(db, 'volume', 'volume');

	//Give all detgernts class
	//detCategory(db);


	/*mr = db.command({
		"mapreduce" : "my_collection",
		"map" : function() {
		for (var key in this) { emit(key, null); }
		},
		"reduce" : function(key, stuff) { return null; }, 
		"out": "my_collection" + "_keys"
	})

	db[mr.result].distinct("_id")*/

//var obj = [{ "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"}, { "_id" : "NM", "volume" : 408.9, "color" : [0,255,0], "category" : "maltoside", "composite":"toto"}];


	//deleteData(db);

/*function getDeepKeys() {
	obj = FindinDet();
    var keys = [];
    for(var i in obj) {
    	for(j=0; j<Object.keys(obj[i]).length; j++){
    		if(keys.includes(Object.keys(obj[i])[j]) == false){
    			keys.push(Object.keys(obj[i])[j]);
    		}
    	}
    }
    console.log(keys);
}

getDeepKeys(obj);*/



});





//EXPORT

module.exports = {
	testFront: testFront,
  	FindinDet: FindinDet,
  	getallkeys: getallkeys,
  	insertData: insertData,
  	deleteData: deleteData,
  	deleteDet: deleteDet,
  	insertDet: insertDet,
  	modifyDet: modifyDet,
	modifyCaract, modifyCaract,
  	deleteCaract: deleteCaract,
  	detCategory: detCategory
};





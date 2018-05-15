var jsonfile = require('jsonfile');
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events');
var backupModule = require('./mongodb_backup.js');



//Function to run the backup
var runBackup = function(time){
	backupModule.backup(time);
}

//Function to check conditions for insert detergents 
/* Caracteristics category, _id, volume, color are needed (not null) :
* category : string
* _id : string
* volume : number
* color : object
*/

var checkConditionsInsert = function(detergent){
	let check = true;
	if(typeof(detergent.category) !== 'string' || detergent.category === 'null'){
		check = 'The detergent category must be filled with string type';
		return check;
	}
	if (typeof(detergent._id) !== 'string' || detergent.name === 'null'){
		check = 'The detergent name must be filled with string type';
		return check;
	}
	if (typeof(detergent.volume) !== 'number' || detergent.volume === 'null'){
		check = 'The detergent volume must be filled with number type';
		return check;
	}
	if (typeof(detergent.color) !== 'object' || detergent.color.length !== 3) {
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

//Function to modify 'detBelt' format in 'mongo' format
/* Input : JSON in 'detBelt' format
* Output : Json in 'mongo' format (database format )
*/
var Json_detBelt_mongo = function(path) {
	let dict = jsonfile.readFileSync(path,'utf8'); //contain the JSON
	let write = []; 

	let values = Object.keys(dict.data).map(function(key) { 
    	return dict.data[key];
	});
	
	for(let i=0; i<values.length; i++){ //for each class of detergent (eg: maltoside)
	
		for(let j=0; j<values[i].length; j++){ //for each detergent
			let det = values[i][j];
			det.category = Object.keys(dict.data)[i];
			if(det['name']){
				det['_id'] = det['name']; //Rename key 'name' to '_id'
			}
			delete det['name'];
			modifyColor(det.color); //Normalization of colors
			write.push(det);
		}
	}
	dict.data = write; //replace "data" values
	
	return dict;
}

//Function to insert JSON file in database
/* path : path of the JSON file 
*/

var insertData = function(db, path) {
	return new Promise((resolve,reject)=>{
		let dict = Json_detBelt_mongo(path);
		for(let i=0; i<dict.data.length; i++){ //for each detergent
			let detergent = dict.data[i];
			let check = checkConditionsInsert(detergent);
			if(check === true){ //if conditions are check
				db.collection("tingoDet.json").insert(detergent, function(err,result){
					if(err){
						if (err.code === 11000) { //if _id is not unique
							let nameDet = err.errmsg.split('"')[1]; //id of the detergent error
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
		resolve('finished')
		backupModule.control_backup(true); //variable backup = true, the database has been modified

	})

	
}

//Function to return the database

var FindinDet =  function(db) {
	return new Promise((resolve, reject)=> {
		let collection = db.collection('tingoDet.json');
		//console.log(collection)
  		let res;
		collection.find({}).toArray(function(error,content){
			resolve(content);

		});	
	});
}

/*
var _FindinDet =  function(db) {
	let emitterDb = new EventEmitter(); 
  	let collection = db.collection('tingoDet.json');
  	let res;
	collection.find({}).toArray(function(error,content){
		res = content
		emitterDb.emit('displayDb',res)
	});
	
	//console.log(res)
	return emitterDb;
}
*/

var Find_a_Det = function(db,id){
	return new Promise((resolve,reject)=>{
		let collection = db.collection('tingoDet.json');
 		collection.find({"_id":id}).toArray(function(error,content){
			let det;	
			if(content.length === 0){
				det = {"error":"this detergent is probably not in our database"};	
			}else{
				det = content;
			};
			resolve(det)
		});
	})
}


/*
var _Find_a_Det =  function(db,id) {
	let emitterDet = new EventEmitter();
  	let collection = db.collection('tingoDet.json');
 	collection.find({"_id":id}).toArray(function(error,content){
		let det;	
		if(content.length === 0){
			det = {"error":"this detergent is probably not in our database"};	
		}else{
			det = content;
		};
		emitterDet.emit('DetFound',det)
	});
	return emitterDet;
}
*/
var Find_all_id = function(db){
	return new Promise((resolve,reject)=>{
		let collection = db.collection('tingoDet.json');
		collection.find({},{"id":1}).toArray(function(error,content){
			let l_id = [];
			content.forEach(function(doc){
				l_id.push(doc["_id"]);
			})
 			resolve(l_id);
		});
	})
}




/*
var _Find_all_id = function(db){
	let emitterId = new EventEmitter();
  	let collection = db.collection('tingoDet.json');
	collection.find({},{"id":1}).toArray(function(error,content){
		let l_id = [];
		content.forEach(function(doc){
			l_id.push(doc["_id"]);
		})
 		emitterId.emit('allIdDone',l_id)
	});
	return emitterId;
}
*/

/////////////////////////////////////////////////
//Function to return all keys of the database


var getallkeys = function(db){
	return new Promise((resolve, reject)=> {
		let allKeys = {};
		let collection = db.collection('tingoDet.json');
		collection.find({}).toArray(function(error,content){
			content.forEach(function(doc){
				Object.keys(doc).forEach(function(key){allKeys[key] = '1'})
			})
			let l_keys = Object.keys(allKeys)
			let ordered_l_keys = []
			let idControl = false;
			for(let i of l_keys){
				if(i !== "_id" ){
					ordered_l_keys.push(i)
				}
				else{
					idControl = true;
				}
			}
			if(idControl){
				ordered_l_keys.unshift("_id")
			}
			resolve(ordered_l_keys);
		})
	})
}


/*
var _getallkeys = function(db){

	let emitterKey = new EventEmitter();
	let allKeys = {};
	let collection = db.collection('tingoDet.json');
	collection.find({}).toArray(function(error,content){
		content.forEach(function(doc){
			Object.keys(doc).forEach(function(key){allKeys[key] = '1'})
		})
		let l_keys = Object.keys(allKeys)
		emitterKey.emit('allKeyDone',l_keys)


		//return l_keys;
	})
	return emitterKey;	
		
}
*/

//Function to delete the database
/*
var _deleteData = function(db){
	let emitter = new EventEmitter();
	db.collection("tingoDet.json").drop(function(err,result){ //deletion of the database
		if(err){
	    	emitter.emit('errorCode', ['Error', 'Error in the deletion of ' + idDet]); // can this be working ? (projet S1)
		}
		else{
			let msg = 'The database has been deleted;'
			console.log('The database has been deleted');
			backupModule.control_backup(true);
			emitter.emit('deleteOK', msg, result);
		}
	});
	return emitter;
}
*/
var deleteData = function(db){
	return new Promise((resolve,reject)=>{
		db.collection("tingoDet.json").drop(function(err,result){ //deletion of the database
		if(err){
	    	reject({"status":'Error', "data": 'Error in the deletion of ' + idDet});
		}
		else{
			let msg = 'The database has been deleted'
			//console.log('The database has been deleted');
			backupModule.control_backup(true);
			resolve({"msg":msg, "result":result});
		}
		});
	})
}
//Function to delete a detergent 
/*idDet : variable with the _id of the detergent to delete
*/
/*
var _deleteDet = function(db, idDet){
	let emitter = new EventEmitter();
	db.collection('tingoDet.json').remove({'_id' : idDet}, function(err, result) {
	    if (err){
	    	emitter.emit('errorCode', ['Error', 'Error in the deletion of ' + idDet]);
	    }
	    else{
	    	let msg = idDet + ': The detergent has been removed';
	    	console.log(msg);
	    	backupModule.control_backup(true);
	    	emitter.emit('deleteOK', ['OK_delete', msg]);
		}
    });
    return emitter;
}
*/
var deleteDet = function(db, idDet){
	return new Promise((resolve,reject)=>{
		db.collection('tingoDet.json').remove({'_id' : idDet}, function(err, result) {
	    if (err){
	    	reject({"status":'Error', "data":'Error in the deletion of ' + idDet});
	    }
	    else{
	    	let msg = idDet + ': The detergent has been removed';
	    	console.log(msg);
	    	backupModule.control_backup(true);
	    	resolve({"status":"OK_delete","data": msg});
		}
    });
	})
}


//Function to add a new detergent 
/*det : variable like { "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"})
*/
/*
var _insertDet = function(db, det){
	let emitter = new EventEmitter();
	modifyColor(det);
	console.log(det);
	let check = checkConditionsInsert(det); //verification of conditions
	if(check === true){ //if the conditions are verified
		db.collection('tingoDet.json').insert(det, function(err,result){
			if(err){
				if (err.code == 11000) { //11000 : error code for an already existing identifier
				console.log('The detergent name must be unique');
				emitter.emit('nameNotUnique', ['Error', 'The detergent name must be unique']);
				}
				else{
					emitter.emit('errorCode', ['Error', 'Error in the insertion of detergent']); 
				}
			}
			else{
				console.log('The detergent has been added');
				backupModule.control_backup(true);
				emitter.emit('insertOK',['OK_insert', 'The detergent has been added']);
			}
		});
	}
	return emitter;
}
*/
var insertDet = function(db, det){
	return new Promise((resolve,reject)=>{
		modifyColor(det);
		let check = checkConditionsInsert(det); //verification of conditions
		if(check === true){ //if the conditions are verified
			db.collection('tingoDet.json').insert(det, function(err,result){
				if(err){
					if (err.code == 11000) { //11000 : error code for an already existing identifier
						console.log('The detergent name must be unique');
						reject({"status":'Error', "data": "The detergent name must be unique"});
					}
					else{
						reject({"status":'Error', "data":"Error in the insertion of detergent"}); 
					}
				}
				else{
					console.log('The detergent has been added');
					backupModule.control_backup(true);
					resolve({"status":'OK_insert',"data":'The detergent has been added'});
				}
			});
		}
	})
}

//Function to modify a detegent
/*id : _id of the detergent to modify
* det : object contain object of the detergent { "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"})
*/


var modifyDet = function(db, id, det){
	return new Promise((resolve,reject)=>{
		modifyColor(det.color);
		let check = checkConditionsInsert(det);
		if(check === true){
			db.collection('tingoDet.json').find({'_id' : id}).toArray((err, result) => {
			if(err){
				reject({"status":'Error',"data":'Error in the modification of ' + id}); 
			}
			if(result.length === 1){
				db.collection('tingoDet.json').update({'_id' : id},{$set: det}, function(err,result){
					if(err){
						reject({"status":'Error',"data":'Error in the modification of ' + id}); 
					}
					else{
						msg = 'The detergent ' + id + ' has been updated';
						console.log(msg);
						backupModule.control_backup(true);
						resolve({"status":'OK_modif',"data":msg});
					}
				});
			}
			else{
				msg = 'The detergent ' + id + ' is present more than one time';
				console.log(msg);
				reject({"status":'Error', "data": msg});
			}
		})
		}
		else{
			console.log(check);
			reject({"status":'Error', "data":check});
		}
	})
}


//Function to delete a caracteristic of detergents
/*caract : caracteristic to delete
the characteristic will be removed from all detergents containing it
*/
var deleteCaract = function(db, caract){
	let emitter = new EventEmitter();
	let todelete = {};
	todelete[caract] = 1;
	db.collection('det').update({}, {$unset: todelete} , {multi: true}, function(err,result){
			if(err){
				emitter.emit('errorCode', ['Error', 'Error in the deletion of caracteristic ' + caract]);
			}
			else{
				console.log('The caracteristic ' + db + ' has been deleted for all detergents');
				backupModule.control_backup(true);
				return ['OK_delete', 'The caracteristic ' + db + ' has been deleted for all detergents'];
			}
	});
}



//Function to rename a caracteristic of detergents
/*caract1 : name of the caracteristic in the database
*caract2 : new name
*/
var modifyCaract = function(db, caract1, caract2){
	let rename = {};
	rename[caract1] = caract2;
	db.collection('det').update({}, {$rename: rename}, {multi: true}, function(err,result){
		if(err){
			emitter.emit('errorCode', ['Error', 'Error in the modification of caracteristic ' + caract1]);
		}
		else{
			console.log('The caracteristic ' + caract1 + ' has been rename ' + caract2);
			backupModule.control_backup(true);
			emiter.emit(modifOK, ['OK_modif', 'The caracteristic ' + caract1 + ' has been rename ' + caract2])
		}
	});
	return emitter;
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



//Function to return the database
var db_for_detbelt = function(){
    FindinDet().then(function(items) { //items contain all the detergents
    	items = {'items' : items};
        return backupModule.Json_mongo_detBelt_format(items);
    });
}


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
  	detCategory: detCategory,
  	db_for_detbelt: db_for_detbelt,
  	runBackup : runBackup,
  	//testmongo : testmongo,
  	Find_a_Det : Find_a_Det,
  	Find_all_id : Find_all_id
};

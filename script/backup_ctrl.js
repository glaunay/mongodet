var mongo = require('../mongo');
var tingo = require('../tingo');
var cronJob = require('cron').CronJob
var fs = require('fs');
var jsonfile = require('jsonfile');

/*var newDir = function(){
    let currentDate = new Date(); // Current date
    let newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    path = './backup/' + newBackupDir;
    console.log(path)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);  //to create a repertory named with date
    }
    
    let newBackupFile = './backup' + '/' + newBackupDir + '/' + newBackupDir ;
    return newBackupFile
}
*/


var extractdb = function(db){
	console.log("inside dbSave")
	//let newFile =  newDir() + '_database.json';
	tingo.FindinDet(db).then(function(items) {
		console.log(items)
		//jsonfile.writeFileSync(newFile,items)
	})
}
/*
var Json_database_mongo = function(path) {
    let dict = jsonfile.readFileSync(path,'utf8');
    let write = {"data":dict};
    let newFile =  newDir() + '_mongo.json';

    jsonfile.writeFileSync(newFile, write, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
    });
}
*/

async function startUp(b_delete,db){
	if(b_delete) {
		await tingo.deleteData(db)
	}
	await tingo.insertData(db)
	return('inserted')
}

/*
var Json_mongo_detBelt_format = function(data) { 
    if(data.hasOwnProperty('items')) {
        var dict = {"data": data.items};
    }
    else if(data.hasOwnProperty('path')) {
        var dict = jsonfile.readFileSync(data.path,'utf8'); //if data is a file (.json)
    }
    else{
        console.log('Input is not an item or a file');
    }
    
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
}

var Json_mongo_detBelt = function(path) {
    dict = Json_mongo_detBelt_format({'path' : path});
    var newFile = newDir() + '_detBelt.json';
    jsonfile.writeFileSync(newFile, dict, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
    });
}

var backup = function(time,db){
    backup_time = time.minutes + ' ' + time.hours + ' * * *';
    new cronJob(backup_time, function() { //Every day at 19h00
        if(b_backup){ 
            let dir_database = newDir() + '_database.json';
            let dir_mongo = newDir() + '_mongo.json';
            extractdb(db);
            Json_database_mongo(dir_database);
            Json_mongo_detBelt(dir_mongo);
            console.log('The extraction of the database is finished !')
            b_backup = false;
        }
    }, null, true, 'Europe/Paris');        
}
*/

var control_backup = function(value){
    if(typeof(value) == 'boolean'){
        b_backup = value;
    }
    else{
        console.log('Warning : error in backup variable')
    }
}


module.exports = {
    control_backup: control_backup,
    //backup : backup,
    //startUp : startUp,
    extractdb : extractdb
}
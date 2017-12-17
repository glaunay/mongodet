var jsonfile = require('jsonfile');
var spawn = require('child_process').spawnSync;
var cronJob = require('cron').CronJob
var fs = require('fs');

//If variable b_backup = true : do backup
//var b_backup = false;


var app = require('./app');


//Function to create a new repertory
var newDir = function(){
    currentDate = new Date(); // Current date
    let newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    path = './backup/' + newBackupDir;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);  //to create a repertory named with date
    }
    
    let newBackupFile = './backup' + '/' + newBackupDir + '/' + newBackupDir ;
    return newBackupFile
}


//function to extract the database
var extractdb = function () {
    let newBackupFile = newDir() + '_database.json';
    spawn('mongoexport',['--db','det','--collection', 'det', '--out', newBackupFile, '--jsonArray']);
}


//Function to convert the database in 'mongo' format and save document
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



//Function to convert the 'mongo' format in 'detbelt' format 
/* Input : data contains
* - 'path' if it is a file
* - 'items' if it is a variable
*/
var Json_mongo_detBelt_format = function(data) { 
    if(data.hasOwnProperty('items')) {
        let dict = {"data": data.items};
    }
    else if(data.hasOwnProperty('path')) {
        let dict = jsonfile.readFileSync(data.path,'utf8'); //if path is a file (.json)
    }
    else{
        console.log('Input is not an item or a file');
    }
     //   else if(if(data.hasOwnProperty('items')) {})
       //     else console..
    /*if(path.includes('.') == true){
        var dict = jsonfile.readFileSync(path,'utf8'); //if path is a file (.json)
    }else{
        var dict = {"data": path};
    }*/
    
    let write = {};
    let category = [];
    let counter = 0;
    let tempo = '';
    

    let values = Object.keys(dict.data).map(function(key) {
        return dict.data[key];
    });
    
    for(let i=0; i<values.length; i++){ //for each detergent
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



//Function to save 'detBelt' format in a file
var Json_mongo_detBelt = function(path) {
    dict = Json_mongo_detBelt_format({'path' : path});
    let newFile = newDir() + '_detBelt.json';
    jsonfile.writeFileSync(newFile, dict, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
    });
}




//Function to execute a function automatically at a certain time
var backup = function(time){
    backup_time = time.minutes + ' ' + time.hours + ' * * *';
    new cronJob(backup_time, function() { 
        if(b_backup){ 
            let dir_database = newDir() + '_database.json';
            let dir_mongo = newDir() + '_mongo.json';
            extractdb();
            Json_database_mongo(dir_database);
            Json_mongo_detBelt(dir_mongo);
            console.log('The extraction of the database is finished !')
            b_backup = false;
        }
    }, null, true, 'Europe/Paris');        
}


//Function to controle the backup_time
var control_backup = function(value){
    if(typeof(value) == 'boolean'){
        b_backup = value;
    }
    else{
        console.log('Warning : error in backup variable')
    }
}


    
module.exports = {
    Json_mongo_detBelt_format: Json_mongo_detBelt_format,
    backup: backup,
    control_backup: control_backup
}
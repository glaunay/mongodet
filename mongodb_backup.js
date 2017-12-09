var jsonfile = require('jsonfile');
var spawn = require('child_process').spawnSync;
var cronJob = require('cron').CronJob
var fs = require('fs');

//If variable b_backup = true : do backup
var b_backup = false;


//Function to create a new repertory
var newDir = function(){
    currentDate = new Date(); // Current date
    var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    path = './backup/' + newBackupDir;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);  //to create a repertory named with date
    }
    
    var newBackupFile = './backup' + '/' + newBackupDir + '/' + newBackupDir ;
    return newBackupFile
}


//function to extract the database
var extractdb = function () {
    var newBackupFile = newDir() + '_database.json';
    spawn('mongoexport',['--db','det','--collection', 'det', '--out', newBackupFile, '--jsonArray']);
}


//Function to convert the database in 'mongo' format
var Json_database_mongo = function(path) {
    var dict = jsonfile.readFileSync(path,'utf8');
    var write = {"data":dict};
    var newFile =  newDir() + '_mongo.json';

    jsonfile.writeFileSync(newFile, write, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
    });
}



//Function to convert the 'mongo' format in 'detbelt' format 
var Json_mongo_detBelt = function(path) {
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

    var newFile = newDir() + '_detBelt.json';
    jsonfile.writeFileSync(newFile, dict, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
    });
    //console.log(dict);
    return dict;
}




//Function to execute a function automatically at a certain time

var backup = function(){
    //if(hour != '' && minute != ''){
        //let time = hour + ' ' + minute + ' * * *';
        //console.log(time);
        //console.log('function backup' + b_backup);
       
            new cronJob('29 20 * * *', function() { //Every day at 19h00
                if(b_backup){ 
                    var dir_database = newDir() + '_database.json';
                    var dir_mongo = newDir() + '_mongo.json';
                    extractdb();
                    Json_database_mongo(dir_database);
                    Json_mongo_detBelt(dir_mongo);
                    console.log('The extraction of the database is finished !')
                    b_backup = false;
                }
            }, null, true, 'Europe/Paris');

        
}


var control_backup = function(value){
    if(typeof(value) == 'boolean'){
        b_backup = value;
        console.log(b_backup);
    }
    else{
        console.log('Warning : error in backup variable')
    }
}


    
module.exports = {
    backup: backup,
    control_backup: control_backup
}
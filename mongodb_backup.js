var jsonfile = require('jsonfile');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;


//Function to create a new repertory
var newDir = function(){
    currentDate = new Date(); // Current date
    var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    mkdirp('./backup/' + newBackupDir); //to create a repertory each day
    var newBackupFile = './backup' + '/' + newBackupDir + '/' + newBackupDir ;
    return newBackupFile
}


//function to extract the database
var dbAutoBackUp = function () {
    var newBackupFile = newDir() + '_database.json';
    console.log(newBackupFile);
    spawn('mongoexport',['--db','det','--collection', 'det', '--out', newBackupFile, '--jsonArray']);
}


//Function to convert the database in 'mongo' format
var Json_database_mongo = function(path) {
    var dict = jsonfile.readFileSync(path,'utf8');
    var write = {"data":dict};

    var newFile = newDir() + '_mongo.json';

    jsonfile.writeFile(newFile, write, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
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
    jsonfile.writeFile(newFile, dict, {spaces:2}, function(err) { //to write in a file
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    //console.log(dict);
    return dict;
}


//Json_mongo_detBelt('2017-12-2_mongo.json');
    
module.exports = {
    newDir: newDir,
    dbAutoBackUp: dbAutoBackUp,
    Json_database_mongo: Json_database_mongo,
    Json_mongo_detBelt: Json_mongo_detBelt
}
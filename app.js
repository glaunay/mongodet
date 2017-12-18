/* Imports */

var express = require('express');
var jsonfile = require('jsonfile')
var mongo = require('./mongo');
var MongoClient = require('mongodb').MongoClient;
var {spawn} = require('child_process');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var events = require('events');
const child = spawn('mongod');  // find a way to shut it when out of the program // sudo service mongod start seems not to work
var backupModule = require('./mongodb_backup'); 


// Default User implemented for history

var User="random_user";

//
// Init the database with options

//boolean default values

var b_mongo_t = false; //allow to activate mongo_test mode when true
var b_history = false; //allow to activate history when true


/* This block manage options developped in the command line part of the project */

arg = process.argv;


process.argv.forEach(function(val,index,array){
    if(val === "--history") {
    b_history = true;
}
  if (val === "-init"){
    MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
    if (err) {
        throw err;
      }
      else {

        mongo.insertData(db, __dirname+'/'+arg[arg.indexOf("-init")+1]);
        if(b_history ===true){
          write_history("init",__dirname+'/'+arg[arg.indexOf("-init")+1])
        } 
      }
        })
  }
  else if(val === "-reinit"){
    MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
      if (err) {
        throw err;
      }
      let deleteRes = mongo.deleteData(db); 
      deleteRes.on('deleteOK',function(msg,result){
        mongo.insertData(db, __dirname+'/'+array[index+1]); //the emitter is used to force the execution's order
        if(b_history ===true){
        write_history("reinit",__dirname+'/'+arg[arg.indexOf("-reinit")+1])
      } 
 
      })
    })
    }
    if (val === "--testmongo"){
    b_mongo_t = true;
    mongo.testmongo(); 
  }

  if (val === "-backup"){
    let backup_hour = arg[arg.indexOf("-backup")+1];
    let backup_minutes = arg[arg.indexOf("-backup")+2];
    backup_hour = Number(backup_hour);
    backup_minutes = Number(backup_minutes);
    if (Number.isInteger(backup_hour) && Number.isInteger(backup_minutes)){
      if(backup_hour <= 23 && backup_hour >= 0 && backup_minutes <=59 && backup_minutes >= 0 ){
        let backup_time = {"hours":backup_hour,"minutes":backup_minutes}; //the data are send to mongo.js in this format
        backupModule.control_backup(false)
        mongo.runBackup(backup_time);
      }
      else{
        throw("the time you chose for the backup is incorrect");
      }
      
    }
    else{
      throw("the time you chose for the backup is incorrect");
    }
    }


  })


// usefull functions

/* This function was made to write the history of the project
*  It's purpose was to see the modifications of the database 
*  in a csv file (separator ";" ) that will be accessible on a 
*  web page in the future.
*/ 

// This function allow to write history

var write_history = function(state,data){
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let hh = today.getHours()
  let yyyy = today.getFullYear();

  if(dd<10) {
    dd = '0'+dd
  } 

  if(mm<10) {
    mm = '0'+mm
  } 

  fs.appendFileSync("./history.csv", today + ";" + state + ";" + data + ";"+ User + "\n") 

}

// This function allows to get data that has been modified and to send them to the modification history

var get_data = function(object){
  let to_return = [];
  let keys = Object.keys(object);
  let values = Object.values(object);
  for(var i = 0 ; i<keys.length; i++){
    if(keys[i]==="color"){
      to_return.push(keys[i]+" : ["+values[i]+"]")
    }
    else{
      if (values[i]===""){
        to_return.push(keys[i]+" : "+null)
      }
      to_return.push(keys[i]+" : "+values[i]) 
    }
  }
  return(to_return);
}


//HTML routes

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html')
})

app.get('/getKeys',function(req, res,next){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
      if (err) {
        throw err;
        }
        return(mongo.getallkeys(db)).then(function(items){
        res.send(items);

        })
        })
         
    })

app.get('/help', function(req, res) {
  res.sendFile(__dirname + '/html/help.html')
})


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use('/script', express.static(__dirname + '/script'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));
app.use('/pic', express.static(__dirname + '/images'));
app.get('/img/:file', function (req, res, next) {
  console.log('Detergent image request:', req.params.file);
  next();
}, function (req, res, next) {
  res.sendFile(__dirname + '/data/pdb_images/'+req.params.file);
});

app.get('/pdb/:file', function (req, res, next) {
  console.log('Detergent PDB file request:', req.params.file);
  next();
}, function (req, res, next) {
  res.sendFile(__dirname + '/data/pdb_files/'+req.params.file);
});
app.use('/css', express.static(__dirname + '/style'));

// Operations on the database

app.use('/data', express.static(__dirname + '/data'));

app.use('/loadTab',function (req, res, next) {   /// to load the data in the database
  mongo.FindinDet().then(function(items) {
  let test = items;
    res.send({"data":test});
    next();
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

  
});

// Intercept json from POST request

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Add a new detergent to the database

app.post('/newDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let to_insert = req.body;
  to_insert.volume=Number(to_insert.volume,10)
  if (to_insert._id==''){
    to_insert._id = null  //replace empty id by null so it can't be added to the database
  }
  if (isNaN(to_insert.volume)) {
      to_insert.volume = null  //not numeric values musn't be added to the database for the volume
  }
  if (to_insert.category == ''){
    to_insert.category = null  //category is another required field so if empty it's transformed to null
  }
  to_insert.color=[Number(to_insert.color[0]),Number(to_insert.color[1]),Number(to_insert.color[2])]
  let insertDet = mongo.insertDet(db,to_insert)
  insertDet.on('insertOK',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]})  //data are exchanged in JSON format for more conveniency
        if(b_history==true){
    write_history("added",get_data(to_insert))
      } 
      })
  insertDet.on('nameNotUnique',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} ) 
      })
  insertDet.on('errorCode',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} ) 
      })
});
});

// Remove a detergent from the database

app.post('/removeDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let to_delete = req.body;
  let deleteDet = mongo.deleteDet(db,to_delete._id);
  deleteDet.on('deleteOK',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} ) //depending on the message sent, the removal will be done or not
      })  
  if(b_history==true){
    write_history("deleted",get_data(to_delete))
  }

});
});

// Update a detergent into the database

app.post('/updateDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let to_update = req.body;
  to_update.volume = Number(to_update.volume)
  to_update.color=[Number(to_update.color[0]),Number(to_update.color[1]),Number(to_update.color[2])]
  if (isNaN(to_update.volume)) {
      to_udate.volume = null
  }
  //this block is not compatible with column management
  //these are optionnal fields so if we delete them this code 
  //will produce errors

  /*if (to_update.MM != ''){
    to_update.MM = Number(to_update.MM)
  }
  if (to_update.CMC != ''){
    to_update.CMC = Number(to_update.CMC)
  }
  if (to_update.Aggregation_number != ''){
    to_update.Aggregation_number = Number(to_update.Aggregation_number)
  }
  */
    let updatedet = mongo.modifyDet(db,to_update._id,to_update);
    updatedet.on('modifOK',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} ) 
    })
    updatedet.on('errorCode',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} ) 
    })
    updatedet.on('error',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]} )
    })  
  if(b_history==true){
    write_history("updated",get_data(to_update))
  }
  


});
});

//In the current version of the project, these functions are not used

//Delete a column

app.post('/removeCol',function(req,res){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let col = req.body.column;
  res.send(mongo.deleteCaract(db,col));
});
});

//Modify a column name

app.post('/modifCol',function(req,res){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let old_col = req.body.old_column;
  let new_col = req.body.new_column;
  mongo.modifyCaract(db,old_col,new_col);
});
});

if(b_mongo_t === false){   //this line ensure the fact that the webpage is not launched when running mongo_test

app.listen(3000, function () {
  console.log('mongodet server listening on port 3000!')
})

}



module.exports = app; //mongodb_backup.js needs it



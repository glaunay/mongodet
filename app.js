var express = require('express');
var jsonfile = require('jsonfile')
var mongo = require('./mongo');
var MongoClient = require('mongodb').MongoClient;
var {spawn} = require('child_process');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var events = require('events');
const child = spawn('mongod'); // find a way to shut it when out of the program // sudo service mongod start seems not to work
var backupModule = require('./mongodb_backup'); 


// User

var User="random_user";

//
// Init the database with options

//boolean default values

var b_mongo_t = false;
var b_history = false;
var b_backup = false;

// test parameters

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
      let deleteRes = mongo.deleteData(db); //emetteur
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
    mongo.testmongo(); // not the good function
  }

  if (val === "-backup"){
    let backup_hour = arg[arg.indexOf("-backup")+1];
    let backup_minutes = arg[arg.indexOf("-backup")+2];
    backup_hour = Number(backup_hour);
    backup_minutes = Number(backup_minutes);
    if (Number.isInteger(backup_hour) && Number.isInteger(backup_minutes)){
      if(backup_hour <= 23 && backup_hour >= 0 && backup_minutes <=59 && backup_minutes >= 0 ){
        let backup_time = {"hours":backup_hour,"minutes":backup_minutes};
        //b_backup = true;
        // here I call the backup function
        backupModule.control_backup(false)
        mongo.runBackup(backup_time);

        //console.log(backup_time);
      }
      else{
        throw("the time you chose for the backup is incorrect");
      }
      
    }
    else{
      //console.log("the time you chose for the backup is incorrect");
      throw("the time you chose for the backup is incorrect");
    }
    }


    //console.log({"hours":typeof(backup_hour),"minutes":backup_minutes})
  })





  /*else if (arg[2]=="--testmongo"){
    var obj = [{ "_id" : "OM", "volume" : 391.1, "color" : [0,255,0], "category" : "maltoside"}, { "_id" : "NM", "volume" : 408.9, "color" : [0,255,0], "category" : "maltoside", "composite":"toto"}];
      if (arg[3]=="--insert"){
        MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
          if (err) {
            throw err;
          }
        mongo.insertData(db,obj); 
    }) 
      return 0;
  }}*/

// usefull functions

/* This function was made to write the history of the project
*  It's purpose was to see the modifications of the database 
*  in a csv file that will be accessible on a web page in the
*  future. Note that the hour diplayed is the one from London.
*/ 
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

  //today = mm + '/' + dd + '/' + yyyy;
  fs.appendFileSync("./history.csv", today + ";" + state + ";" + data + ";"+ User + "\n") 

  //return 0;
}


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

//Partie HTML



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html')
})

app.get('/getKeys',function(req, res,next){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
      if (err) {
        throw err;
        }
        return(mongo.getallkeys(db)).then(function(items){
            //res.send({"value":mongo.getallkeys(db)});
            //console.log(items)
            res.send(items);

        })
        })
         
    })

app.get('/help', function(req, res) {
  res.sendFile(__dirname + '/html/help.html')
})
// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handler
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
    //console.log(items.length) 
    res.send({"data":test});
    next();
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

  
});

// intercept json from POST request

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/newDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let to_insert = req.body;
  to_insert.volume=Number(to_insert.volume,10)
  if (to_insert._id==''){
    to_insert._id = null
  }
  if (isNaN(to_insert.volume)) {
      to_insert.volume = null
  }
  if (to_insert.category == ''){
    to_insert.category = null
  }
  to_insert.color=[Number(to_insert.color[0]),Number(to_insert.color[1]),Number(to_insert.color[2])]
  let insertDet = mongo.insertDet(db,to_insert)
  //console.log(a[0],a[1])
  insertDet.on('insertOK',function(msg,result){
        res.send({"status":msg[0],"data":msg[1]})
        if(b_history==true){
    write_history("added",get_data(to_insert))
      } 
      })
  insertDet.on('nameNotUnique',function(msg,result){
        //ici insertion, on a imposé un ordre
        res.send({"status":msg[0],"data":msg[1]} ) 

      })
  insertDet.on('errorCode',function(msg,result){

        res.send({"status":msg[0],"data":msg[1]} ) 

      })
  


//mongo.insertDet(db,to_insert)
});
});


app.post('/removeDet',function (req, res) {
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let to_delete = req.body;
  //console.log(to_delete._id);
  let deleteDet = mongo.deleteDet(db,to_delete._id);
  deleteDet.on('deleteOK',function(msg,result){
        //ici insertion, on a imposé un ordre
        res.send({"status":msg[0],"data":msg[1]} )

      })  
  if(b_history==true){
    write_history("deleted",get_data(to_delete))
  }

});
});

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
        //ici insertion, on a imposé un ordre
        res.send({"status":msg[0],"data":msg[1]} ) 

    })
    updatedet.on('errorCode',function(msg,result){
        //ici insertion, on a imposé un ordre
        res.send({"status":msg[0],"data":msg[1]} ) 

    })
    updatedet.on('error',function(msg,result){
        //ici insertion, on a imposé un ordre
        res.send({"status":msg[0],"data":msg[1]} )

    })  
  if(b_history==true){
    write_history("updated",get_data(to_update))
  }
  


});
});
app.post('/removeCol',function(req,res){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let col = req.body.column;
  res.send(mongo.deleteCaract(db,col));
  //console.log(col)

});
});

app.post('/modifCol',function(req,res){
  MongoClient.connect('mongodb://localhost:27017/det', function(err, db) { //To connect to 'det' database
  if (err) {
    throw err;
  }
  let old_col = req.body.old_column;
  let new_col = req.body.new_column;
  mongo.modifyCaract(db,old_col,new_col);
  //console.log(col)

});
});


/*
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/detest', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('det').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});
*/
/*
var test =[];
mongo.FindinDet().then(function(items) {
  test = items;
  console.log(test);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});
*/

//console.log(mongo.FindinDet())
/*process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    console.log(process.getegid())
    process.exit();
});
*/

if(b_mongo_t === false){

app.listen(3000, function () {
  console.log('mongodet server listening on port 3000!')
})

}



module.exports = app; //mongodb_backup.js needs it



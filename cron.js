var CronJob = require('cron').CronJob;
var cron = require('./mongodb_backup.js');

 
new CronJob('00 19 * * *', function() { //All days at 19h00
	console.log('database');
    cron.dbAutoBackUp();
}, null, true, 'Europe/Paris');

new CronJob('10 19 * * *', function() {
    var dir = cron.newDir() + '_database.json';
    console.log('mongo');
    cron.Json_database_mongo(dir);
}, null, true, 'Europe/Paris');

new CronJob('20 19 * * *', function() {
    var dir = cron.newDir() + '_mongo.json';
    console.log('detBelt');
    cron.Json_mongo_detBelt(dir);
}, null, true, 'Europe/Paris');

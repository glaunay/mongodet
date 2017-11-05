console.log("getDb begin!");
var readJson=function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	console.log(dict.data);
}
//var dataset=readJson(__dirname+"/../../det.json")
var dataset="friton"

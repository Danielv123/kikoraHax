const express = require("express");
var nedb = require("nedb");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var config = {};

var Datastore = require('nedb');
db = {};
db.items = new Datastore({ filename: 'database/items.db', autoload: true });

fs.stat('database/solutions.json', function(err, stat) {
    if(err == null) {
        tasksInJson = JSON.parse(fs.readFileSync("database/solutions.json", "utf8"));
    } else if(err.code == 'ENOENT') {
        tasksInJson = {};
    } else {
        console.log('Some other error: ', err.code);
    }
});

db.items.additem = function(object) {
	/*db.items.findOne({name:object.name}, function (err, doc) {
		// console.dir(doc);
		if (doc) {
			// Update existing items if item name already exists
			db.items.update(doc, object, {multi:true}, function (err, numReplaced) {
			});
		} else {
			// If command does not match an entry, insert new document
			db.items.insert(object);
			console.log('Item created!');
		}
	})*/
	if(object && object.answer && typeof object.answer == "string"){
		tasksInJson[object.name] = object.answer;
	} else {
		console.error("Error: db.items.additem: object.answer is not string.")
	}
}

setInterval(function(){
	fs.writeFile("database/solutions.json", JSON.stringify(tasksInJson), function(){});
}, 10000)


// endpoint to send items to
app.post("/api/place", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// save items we get
	if(req.body.name && req.body.answer && typeof req.body.answer == "string"){
		console.log("added: " + req.body.name + " " + req.body.answer);
		db.items.additem(req.body)
	} else {
		console.error("Error: invalid req.body at /api/place")
	}
	//db.items.insert(req.body);
	// Attempt confirming
	res.send("success");
});

// endpoint to remove items from DB when client orders items
app.post("/api/get", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var object = req.body;
	if(req.body && req.body.name){
		console.log("/api/get " +JSON.stringify(req.body));
		if(tasksInJson[req.body.name]){
			res.send(tasksInJson[req.body.name])
		} else {
			res.send("No answer");
		}
	} else {
		res.send("No name provided");
	}
});

var server = app.listen(config.masterPort || 8080, function () {
	console.log("Listening on port %s...", server.address().port);
});

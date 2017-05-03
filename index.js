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

fs.stat('foo.txt', function(err, stat) {
    if(err == null) {
        tasksInJson = JSON.parse(fs.readFileSync("database/solutions.txt", "utf8"));
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
	tasksInJson[object.name] = object.answer;
}

setInterval(function(){
	fs.writeFile("database/solutions.txt", JSON.stringify(tasksInJson));
}, 10000)

// endpoint to send items to
app.post("/api/place", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log("added: " + req.body.name + " " + req.body.answer);
	// save items we get
	db.items.additem(req.body)
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
		console.log(req.body)
		if(tasksInJson[req.body.name]){
			res.send(tasksInJson[req.body.name])
		}
	}
	
		/*db.items.findOne({name:req.body.name}), function(err, doc) {
			res.send(doc);
			console.log("Responded: " + JSON.stringify(doc));
			res.end();
			if(err) throw err;
		}*/
	
	/*if(object && object.name){
		db.items.findOne({name:object.name}, function (err, doc) {
			// console.dir(doc);
			if (err) {
				console.log('failure count not find ' + object.name);
			} else {
				if (doc) {
					res.send(doc.answer);
				} else {
					res.send("No answer");
				}
			}
		})
	} else {
		console.log(req.body)
		res.send("FAILURE IDIOT!")
	}*/
});

var server = app.listen(config.masterPort || 8080, function () {
	console.log("Listening on port %s...", server.address().port);
});
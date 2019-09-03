var express    = require("express");
var sql      = require('mssql');
var mysql      = require('mysql');
var bodyParser = require("body-parser");
var nodeSSPI = require('node-sspi');
var cors = require("cors");
var http = require('http')
var auth = require('basic-auth')
var compare = require('tsscmp')

var okrDbConfig = {
	server: '',
	user: '',
	password: '',
  	database: '',
}

var dashboardDbConfig = {
	server: '',
	user: '',
	password: '',
  	database: '',
}

var connection1 = new sql.ConnectionPool(okrDbConfig);
var connection2 = new sql.ConnectionPool(dashboardDbConfig)

var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors options
/* var corsOptions = {
  origin: 'http://d1bapp01',
  optionsSuccessStatus: 200, 
  credentials: true,
} */

// app.use ( cors(corsOptions) );

//Best use for testing, using CORS makes IISNode more stable,
app.use(function(req, res, next) {
	var allowedOrigins = ['http://d1bapp01', 'http://localhost:3000',];
	var origin = req.headers.origin;
	if(allowedOrigins.indexOf(origin) > -1){
		 res.setHeader('Access-Control-Allow-Origin', origin);
	}
	//res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);
	return next();
});

// Connection to CS_OKRTOOL
connection1.connect(function(err){
	if(!err) {
		console.log("Database OKR is connected ... nn");    
	} else {
		console.log("Error connecting database ... nn");    
	}
});

var request1 = new sql.Request(connection1)

// Connection to CS_DASHBOARD
connection2.connect(function(err){
	if(!err) {
		console.log("Database Dashboard is connected ... nn");    
	} else {
		console.log("Error connecting database ... nn");    
	}
});

var request2 = new sql.Request(connection2)

// Basic Authentication for My Objectives and Edit Objectives
// credentials.name: Company Email
// credentials.pass: Company Username
app.get("/username",function(req,res){
	var users = []
	var sql = mysql.format("SELECT username, email FROM [cs_dashboard_prod].[cs_dashboard_prod].[users]")
	request2.query(sql, function (err, rows) {
		if (err) throw err
		else {
			users = rows.recordset
		}
	})

	var credentials = new auth(req)
	if (!credentials ||credentials.name == undefined || !check(credentials.name, credentials.pass)) {
		res.statusCode = 401
		res.setHeader('WWW-Authenticate', 'Basic realm="example"')
		res.end('Access denied')
	  } else {
		res.send(credentials.pass)
		res.end('Access granted')
	}
	function check (name, pass) {
		var valid = true
	   
		// Simple method to prevent short-circut and use timing-safe compare
		users.forEach(function(user) {
			valid = compare(name, user.email) && valid
			valid = compare(pass, user.username) && valid
		})
		console.log(name)
		console.log(pass)
		return valid
	  }
  });

// Get User's name upon successful authentication
app.post("/getusername",function(req,res, next){
	let user = req.body.user
	var sql = mysql.format("SELECT firstname, lastname FROM [cs_dashboard_prod].[cs_dashboard_prod].[users] WHERE username = ?;", user)
	request2.query(sql, function (err, rows) {
		if (err) throw err
		else {
			res.send(rows)
		}
	})
});

// Gets all objectives
app.get("/obj",function(req,res){
	var sql = mysql.format("SELECT * FROM cs_okr_tool.okr_tool.okr")
	request1.query(sql, function(err, rows) {
		if (err) throw err
		else {
			res.send(rows)
		}
	})
});

// Gets all keyresults
app.get("/keyobj",function(req,res){
	var sql = mysql.format("SELECT * FROM cs_okr_tool.okr_tool.keyresults")
	request1.query(sql, function(err, rows) {
		if (err) throw err
		else {
			res.send(rows)
		}
	})
});

// Gets all users
app.get("/getallusers",function(req,res){
	var sql = mysql.format("SELECT username, firstname, lastname FROM [cs_dashboard_prod].[cs_dashboard_prod].[users]")
	request2.query(sql, function (err, rows) {
		if (err) throw err
		else {
			res.send(rows)
		}
	})
});

// Update progress in the My Objective Tab
app.post("/updateprog", function(req, res, next){
	var objectives = req.body.objectives
	var keyobjectives = req.body.keyobjectives

	var objectivesQuery = ""
	objectives.forEach(function(objective) {
	objectivesQuery += mysql.format("UPDATE cs_okr_tool.okr_tool.okr SET progress = ?, lastupdate = ? WHERE id = ?; ", [objective.progress, objective.lastupdate, objective.id])
	})

	var keyobjectivesQuery = ""
	keyobjectives.forEach(function(keyobjective) {
	keyobjectivesQuery += mysql.format("UPDATE cs_okr_tool.okr_tool.keyresults SET progress = ?, confidence = ?, lastupdate = ?  WHERE keyid = ?; ", [keyobjective.progress, keyobjective.confidence, keyobjective.lastupdate, keyobjective.keyid])
	})

	var completeQuery = objectivesQuery + keyobjectivesQuery

	request1.query(completeQuery, function (err, rows) {
	if (err) throw err
	else {
	}
	})
})

// Create new Objective in New Objective tab
app.post("/newobj", function(req, res, next) {
	var objective = req.body

	var objectiveQuery = mysql.format("INSERT INTO cs_okr_tool.okr_tool.okr (id, quarter, name, supervisor, progress, description, lastupdate) VALUES (?, ?, ?, ?, ?, ?, ?)",
	[objective.id, objective.quarter, objective.name, objective.supervisor, objective.progress, objective.description, objective.lastupdate])

	request1.query(objectiveQuery, function (err, rows) {
		if (err) throw err
		else {
		}
	})
})

// Create the new keyresults associated with the new Objective
app.post("/newkeyobj", function(req, res, next) {
	var keyobjectives = req.body.keyobjectives

	var keyobjectivesQuery = ""
	keyobjectives.forEach(function(keyobjective) {
	keyobjectivesQuery += mysql.format("INSERT INTO cs_okr_tool.okr_tool.keyresults (keyid, id, name, owner, valuetype, goalnumber, progress, confidence, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); ",
		[keyobjective.keyid, keyobjective.id, keyobjective.name, keyobjective.owner, keyobjective.valuetype, keyobjective.goalnumber, keyobjective.progress, keyobjective.confidence, keyobjective.description])
	})

	console.log(keyobjectivesQuery)

	request1.query(keyobjectivesQuery, function (err, rows) {
		if (err) throw err
		else {
		}
	})
})

// Delete selected Objectives in the Edit Objectives Tab, along with associated keyresults
// Or simply delete selected key results
app.post("/deleteobj", function(req, res, next){
	var deletedobjectives = req.body.deletedobjectives
	var deletedkeyobjectives = req.body.deletedkeyobjectives

	var deleteObjectivesQuery = ""
	deletedobjectives.forEach(function(objective) {
	deleteObjectivesQuery += mysql.format("DELETE FROM cs_okr_tool.okr_tool.okr WHERE id = ?; ", [objective.id])
	})

	var deleteKeyobjectivesQuery = ""
	deletedkeyobjectives.forEach(function(keyobjective) {
	deleteKeyobjectivesQuery += mysql.format("DELETE FROM cs_okr_tool.okr_tool.keyresults WHERE keyid = ?; ", [keyobjective.keyid])
	})

	var completeQuery = deleteObjectivesQuery + deleteKeyobjectivesQuery

	request1.query(completeQuery, function (err, rows) {
	if (err) throw err
	else {
	}
	})
})

app.listen(port, () => console.log(`Server started on port ${port}`));
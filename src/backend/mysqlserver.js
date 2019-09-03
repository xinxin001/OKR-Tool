var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require("body-parser");
var nodeSSPI = require('node-sspi');
var cors = require("cors");

var dbConfig = {
	host: '',
	user: '',
	password: '',
  database: '',
  multipleStatements: true
}

var connection = mysql.createConnection(dbConfig);

var app = express();
var port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors options
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, 
  credentials: true,
}

app.use ( cors(corsOptions) );

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});

app.get("/username",function(req,res){
  var nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
  })
  nodeSSPIObj.authenticate(req, res, function(err){
    res.send(req.connection.user);
  })
});

app.post("/getusername",function(req,res, next){
  let user = req.body.user
  connection.changeUser({database: 'cs_dashboard_prod'}, function(err) {
    if (err) throw err
  })
  connection.query( "SELECT firstname, lastname FROM users WHERE username = ?", [user], function(err, rows, fields) {
  if (!err){
    res.send(rows)
  }
  else{
    console.log('Error while performing Query.');
  }
  });
});

app.get("/obj",function(req,res){
  connection.changeUser({database: 'okr_tool'}, function(err) {
    if (err) throw err
  })
  connection.query(
    "SELECT * FROM okr", function(err, rows, fields) {
  if (!err){
    res.json(rows);
  }
  else{
    console.log('Error while performing get obj.');
  }
  });
});

app.get("/keyobj",function(req,res){
  connection.changeUser({database: 'okr_tool'}, function(err) {
    if (err) throw err
  })

  connection.query(
    "SELECT * FROM keyresults", function(err, rows, fields) {
  if (!err){
    res.json(rows);
  }
  else{
   console.log('Error while performing get keyobj.');
  }
  });
});

app.get("/getallusers",function(req,res){
  connection.changeUser({database: 'cs_dashboard_prod'}, function(err) {
    if (err) throw err
  })

  connection.query(
    "SELECT username, firstname, lastname FROM users", function(err, rows, fields) {
  if (!err){
    res.send(rows)
  }
  else{
   console.log('Error while performing get getallusers.');
  }
  });
});

app.post("/updateprog", function(req, res, next){
  connection.changeUser({database: 'okr_tool'}, function(err) {
    if (err) throw err
  })

  var objectives = req.body.objectives
  var keyobjectives = req.body.keyobjectives

  var objectivesQuery = ""
  objectives.forEach(function(objective) {
    objectivesQuery += mysql.format("UPDATE okr SET progress = ? WHERE id = ?; ", [objective.progress, objective.id])
  })

  var keyobjectivesQuery = ""
  keyobjectives.forEach(function(keyobjective) {
    keyobjectivesQuery += mysql.format("UPDATE keyresults SET progress = ? WHERE keyid = ?; ", [keyobjective.progress, keyobjective.keyid])
  })

  var completeQuery = objectivesQuery + keyobjectivesQuery
  console.log(completeQuery)
  connection.query(completeQuery, (err, result, fields) => {
      if(err) throw err
      console.log(result)
    }
  )
})

app.post("/newobj", function(req, res, next) {
  connection.changeUser({database: 'okr_tool'}, function(err) {
    if (err) throw err
  })

  var objective = req.body

  var objectiveQuery = mysql.format("INSERT INTO okr (id, name, supervisor, progress, description) VALUES (?, ?, ?, ?, ?)",
  [objective.id, objective.name, objective.supervisor, objective.progress, objective.description])

  console.log(objectiveQuery)
  connection.query(objectiveQuery, (err, result, fields) => {
      if(err) throw err
      console.log(result)
    }
  )
})

app.post("/newkeyobj", function(req, res, next) {
  connection.changeUser({database: 'okr_tool'}, function(err) {
    if (err) throw err
  })

  var keyobjectives = req.body.keyobjectives

  var keyobjectivesQuery = ""
  keyobjectives.forEach(function(keyobjective) {
    keyobjectivesQuery += mysql.format("INSERT INTO keyresults (keyid, id, name, owner, valuetype, goalnumber, progress, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?); ",
     [keyobjective.keyid, keyobjective.id, keyobjective.name, keyobjective.owner, keyobjective.valuetype, keyobjective.goalnumber, keyobjective.progress, keyobjective.description])
  })

  console.log(keyobjectivesQuery)
  connection.query(keyobjectivesQuery, (err, result, fields) => {
      if(err) throw err
      console.log(result)
    }
  )
})

app.listen(port, () => console.log(`Server started on port ${port}`));
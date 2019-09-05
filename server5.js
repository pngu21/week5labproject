let express = require('express');
let app = express(); //config express
let mongodb = require('mongodb');
let ObjectId = mongodb.ObjectID;
let MongoClient = mongodb.MongoClient; //config mongodb
let url = "mongodb://localhost:27017/";
let morgan = require('morgan');
let bodyParser = require('body-parser');
let db;
let viewsPath = __dirname + "/views/";
//let path = require('path');

//conneting the app to the mongodb server
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true}, function (err, client){
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Connected successfully to server");
        db = client.db("tasks");
        db.createCollection("TaskDetailsdb");
    }
});

//setting up the engine
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

//setting up the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
app.use(morgan('common'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
//parse application/json
app.use(bodyParser.json());

/*********************************************/

//GET FUNCTIONS

/*********************************************/

app.get('/', function(req, res){
    console.log("homepage request");

    let filename = viewsPath + "index.html";

    res.sendFile(filename);
});

app.get("/newtask", function(req, res){
    console.log("Add new task");

    let filename = viewsPath + "newtask.html";

    res.sendFile(filename);
});

app.get("/listtasks", function(req, res){
    console.log("List of all tasks");
    db.collection("TaskDetailsdb").find({}).toArray(function(err, data){
        res.render("listtasks.html", {tasks: data});
    });


});

app.get("/updatetask", function(req, res){
    console.log("Update the task");

    let filename = viewsPath + "updatetask.html";

    res.sendFile(filename);
});


app.get("/deletetask", function(req, res){
    console.log("Delete the task by ID");

    let filename = viewsPath + "deletetask.html";

    res.sendFile(filename);
});


app.get("/deleteCompletedTasks", function(req, res){
    db.collection("TaskDetailsdb").find({"status":"Complete"}).toArray(function(err, data){
        if(err) throw err;
        res.render("deleteCompletedTasks.html", {tasks: data});
});

});



/*********************************************/

// POST FUNCTIONS

/********************************************/

app.post("/data", function(req, res){
    console.log(req.body);
    //db.push(req.body);
    let taskDetails = req.body;
    //taskDetails.taskID = getNewId();
    db.collection("TaskDetailsdb").insertOne({
        //taskID: taskDetails.taskID,
        name: taskDetails.name,
        assignTo: taskDetails.assignTo,
        dueDate: taskDetails.dueDate,
        status: taskDetails.status,
        description: taskDetails.description
    });

    res.redirect("/listtasks");

    //res.render("listtasks.html", {tasks: db});
});

app.post("/updatedata", function(req, res){
    let id = new ObjectId(req.body.taskId);
    //let id = getNewId();
    let taskDetails = req.body;
    let filter = {_id: id};
    let update = {$set: {
        //name: taskDetails.namenew,
        //assignTo: taskDetails.assignTonew,
        //dueDate: taskDetails.dueDatenew,
        status: taskDetails.status
        //description: taskDetails.descriptionnew
    }};
    db.collection("TaskDetailsdb").updateOne(filter, update);
    res.redirect("/listtasks");
});

app.post("/deletetaskID", function(req, res){
    let id = new ObjectId(req.body.taskId);
    //let id = getNewId();
    //let taskDetails = req.body;
    let filter = {_id: id};
    db.collection("TaskDetailsdb").deleteOne(filter);
    res.redirect("/listtasks");
});

app.post("/deleteCompleted", function(req, res){
    let remove = {status: 'Complete'};
    db.collection("TaskDetailsdb").deleteMany(remove);
    res.redirect("/listtasks");
});


/*function getNewId(){
    return(Math.floor(100000 + Math.random() * 900000));
}*/




app.listen(8080);
console.log("Server running at 'http://localhost:8080'");
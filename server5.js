let express = require('express');
let app = express(); //config express
let mongodb = require('mongodb');
//let ObjectId = mongodb.ObjectID;
let MongoClient = mongodb.MongoClient; //config mongodb
let url = "mongodb://localhost:27017/allocation";
//let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let Task = require('./models/tasks');
let Developer = require('./models/developers');

//let db;
let viewsPath = __dirname + "/views/";



//conneting the app to the mongodb server
// MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true}, function (err, client){
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Connected successfully to server");
//         //db = client.db("tasks");
//         //db.createCollection("TaskDetailsdb");
//     }
// });

//setting up the engine
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

//setting up the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
//app.use(morgan('common'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
//parse application/json
app.use(bodyParser.json());

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, function (err){
    if (err){
        console.log('Error in mongoose connection');
        throw err;
    }
    console.log('Successfully connected');

/*********************************************/

//GET-FUNCTIONS

/*********************************************/

app.get('/', function(req, res){
    console.log("homepage request");

    let filename = viewsPath + "index.html";

    res.sendFile(filename);
});

app.get("/newtask", function(req, res){
    console.log("Add new task");
    Developer.find({}, function(err, data){
        res.render("newtask.html", {developers: data})
    });

    //let filename = viewsPath + "newtask.html";

    //res.sendFile(filename);
});

app.get("/newdeveloper", function(req, res){
    console.log("Add new developer");
    res.render("newdeveloper.html");
});

app.get("/listtasks", function(req, res){
    console.log("List of all tasks");
    Task.find({}, function(err, data){
    /*db.collection("TaskDetailsdb")*/
        res.render("listtasks.html", {tasks: data});
    });
});

app.get("/listdevelopers", function(req, res){
    console.log("List all developers");
    Developer.find({}, function(err, data){
    /*db.collection()*/
        res.render("listdevelopers.html", {developers: data});
    });
});

app.get("/updatetask", function(req, res){
    console.log("Update the task");
    Task.find({}, function(err, data){
        res.render("updatetask.html", {tasks: data});
    });

    //let filename = viewsPath + "updatetask.html";

    //res.sendFile(filename);
});


app.get("/deletetask", function(req, res){
    console.log("Delete the task by ID");
    Task.find({}, function(req, data){
        res.render("deletetask.html", {tasks: data});
    });

    //let filename = viewsPath + "deletetask.html";

    //res.sendFile(filename);
});


app.get("/deleteCompletedTasks", function(req, res){
    Task.find({"status":"Complete"}, function(err, data){
    /*db.collection("TaskDetailsdb")*/
        if(err) throw err;
        res.render("deleteCompletedTasks.html", {tasks: data});
});

});



/*********************************************/

// POST-FUNCTIONS

/********************************************/

app.post("/data", function(req, res){
    let task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        assignTo: req.body.assignTo,
        dueDate: req.body.dueDate,
        status: req.body.status,
        description: req.body.description
    });
    task.save(function (err){
        if(err) throw err;
        console.log("Task added to database");
    });
    //console.log(req.body);
    //db.push(req.body);
    //let taskDetails = req.body;
    //taskDetails.taskID = getNewId();
    /*db.collection("TaskDetailsdb").insertOne({
        //taskID: taskDetails.taskID,
        name: taskDetails.name,
        assignTo: taskDetails.assignTo,
        dueDate: taskDetails.dueDate,
        status: taskDetails.status,
        description: taskDetails.description
    }); */

    res.redirect("/listtasks");

    //res.render("listtasks.html", {tasks: db});
});

app.post("/addDeveloper", function (req, res){
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name:{
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level,
        address:{
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });
    developer.save(function (err){
        if(err) throw err;
        console.log("Developer added to database");
    });
    res.redirect("/listdevelopers");
})

app.post("/updatedata", function(req, res){
    let id = new mongoose.Types.ObjectId(req.body.taskId);
    //let id = getNewId();
    //let taskDetails = req.body;
    let filter = {_id: id};
    let update = {$set: {
        //name: taskDetails.namenew,
        //assignTo: taskDetails.assignTonew,
        //dueDate: taskDetails.dueDatenew,
        status: req.body.status//taskDetails.status
        //description: taskDetails.descriptionnew
    }};
    Task.updateOne(filter, update, function(err){
        if(err) throw err;
    });
    /*db.collection("TaskDetailsdb")*/
    res.redirect("/listtasks");
});

app.post("/deletetaskID", function(req, res){
    let id = new mongoose.Types.ObjectId(req.body.taskId);
    //let id = getNewId();
    //let taskDetails = req.body;
    let filter = {_id: id};
    Task.deleteOne(filter, function(err){
        if(err) throw err;
    });
    /*db.collection("TaskDetailsdb")*/
    res.redirect("/listtasks");
});

app.post("/deleteCompleted", function(req, res){
    let remove = {status: 'Complete'};
    Task.deleteMany(remove, function (err){
        if(err) throw err;
    });
    /*db.collection("TaskDetailsdb")*/
    res.redirect("/listtasks");
});

});




/*function getNewId(){
    return(Math.floor(100000 + Math.random() * 900000));
}*/




app.listen(8080);
console.log("Server running at 'http://localhost:8080'");
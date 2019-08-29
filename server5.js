let express = require('express');
let app = express();
//const morgan = require('morgan');
let bodyParser = require('body-parser');
let db = [];
let viewsPath = __dirname + "/views/";
//let path = require('path');

//setting up the engine
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

// app.use('/css',express.static(path.join(__dirname, 'css/styles.css')));
// app.use('/images',express.static(path.join(__dirname, 'images/WhatsApp Image 2019-08-27 at 10.57.43.jpeg')));
// app.use('/images',express.static(path.join(__dirname, 'images/WhatsApp Image 2019-08-27 at 10.57.44.jpeg')));
//setting up the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
//app.use(morgan('short'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
//parse application/json
app.use(bodyParser.json());

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

    res.render("listtasks.html", {tasks: db});
});



app.post("/data", function(req, res){
    console.log(req.body);
    db.push(req.body);

    res.render("listtasks.html", {
        tasks: db
    });
});






app.listen(8080);
console.log("Server running at 'http://localhost:8080'");
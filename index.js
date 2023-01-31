const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

//SQL database constants
var sqlConnection = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "123!@#abc"
});

//Connect to SQL database
sqlConnection.connect(function(err, result) {
    if (err) throw err;
    console.log("Connected!");
});

//Function to send queries
function query(queryStr) {
    sqlConnection.query(queryStr, function(err, result) {
        if(err) throw err;
        console.log("Successfully executed " + queryStr);
    });
}
//Create database and table
query("CREATE DATABASE IF NOT EXISTS mydb");
query("USE mydb")
//query("DROP TABLE datapoints")
query("CREATE TABLE IF NOT EXISTS datapoints (id INT AUTO_INCREMENT PRIMARY KEY, t1 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, solarPower INT, windPower INT, windSpeed INT, solarIntensity INT)");

//Set up webserver
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//make directory for html public
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

//When url is pulled up send the date range selection window
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/start.html');
})

//The date range selector redirects to this url with a date range in the query string, send graph viewer page back
app.get('/getData', (req, res) => {
    if(req.query["start"] && req.query["end"]) {
        sqlConnection.query("SELECT * FROM datapoints WHERE (t1>='"+req.query["start"]+"' AND '"+req.query["end"]+"')", function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    } else {
        res.redirect("/");
    }
})

//Python code will post json data to this, and it will be appended to the server. 
app.post('/dataInput', (req, res) => {
    console.log(req.body)
    if(req.body.solarPower && req.body.windPower && req.body.windSpeed && req.body.solarIntensity) {
        res.send('OK')
        query("INSERT INTO datapoints (solarPower, windPower, windSpeed, solarIntensity) VALUES ("+req.body.solarPower + ", " + req.body.windPower+", " + req.body.windSpeed + ", " + req.body.solarIntensity + ")");
    }
})

//Start express JS server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})


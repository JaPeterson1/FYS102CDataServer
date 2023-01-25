const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

var sqlConnection = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "123!@#abc"
});

sqlConnection.connect(function(err, result) {
    if (err) throw err;
    console.log("Connected!");
});

function query(queryStr) {
    sqlConnection.query(queryStr, function(err, result) {
        if(err) throw err;
        console.log("Successfully executed " + queryStr);
    });
}
query("CREATE DATABASE IF NOT EXISTS mydb");
query("USE mydb")
query("DROP TABLE datapoints")
query("CREATE TABLE IF NOT EXISTS datapoints (id INT AUTO_INCREMENT PRIMARY KEY, t1 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, solarPower INT, windPower INT, windSpeed INT, solarIntensity INT)");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/visualizer', (req, res) => {

})

app.post('/dataInput', (req, res) => {
    console.log(req.body)
    if(req.body.solarPower && req.body.windPower && req.body.windSpeed && req.body.solarIntensity) {
        res.send('OK')
        query("INSERT INTO datapoints (solarPower, windPower, windSpeed, solarIntensity) VALUES ("+req.body.solarPower + ", " + req.body.windPower+", " + req.body.windSpeed + ", " + req.body.solarIntensity + ")");
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})


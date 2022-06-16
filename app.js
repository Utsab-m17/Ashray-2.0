require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");

const homeRouter = require("./routers/homeRouter")

const port = process.env.port || 3000;

const app = express();




//------------------ Database connection -------------------

mongoose.connect('mongodb://localhost:27017/ashrayDB',{useNewUrlParser: true});
const db = mongoose.connection;

db.on("error",()=>{console.log("error in connection.");})
db.once("open",()=>{console.log("connected.");})





//--------------------- View-engine ------------------------

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', homeRouter);



app.listen(port);

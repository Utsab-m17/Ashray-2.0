require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")

const homeRouter = require("./routers/homeRouter");
const { decodeBase64 } = require('bcryptjs');

const port = process.env.port || 3000;

const app = express();




//------------------ Database connection -------------------

mongoose.connect('mongodb://localhost:27017/ashrayDB',{useNewUrlParser: true});
const db = mongoose.connection;

db.on("error",()=>{console.log("error in connection.");})
db.once("open",()=>{console.log("connected.");})

// const dbo = db.db('ashrayDB');

// dbo.collection('registerusers').aggregate([
//     {
//         $lookup:
//         {
//             from: 'owners',
//             localField:,
//             foreignField:,
//             as: 
//         }
//     }
// ]).toArray((err,res)=>{
//     if (err) {
//         throw err;
//     } else {
        
//     }
// })






//--------------------- View-engine ------------------------

app.set('view engine','ejs');


app.use(cookieParser());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




//-------------------- Calling Routes ---------------------

app.use('/', homeRouter);



app.listen(port);

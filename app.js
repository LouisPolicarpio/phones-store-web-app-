/**
 * The file to start a server
 *
 */
let express = require('express');
let path = require('path');
let routes = require('./app/routes/routes');
let PhoneListing = require("./app/models/PhoneListing");
let User = require("./app/models/User");
let conn = require("./app/models/database");
let {MongoClient} = require("mongodb");
let assert = require("assert");
const cookieParser = require('cookie-parser')

let app = express();
app.use(express.json())
app.use(cookieParser())

// app.set('views', path.join(__dirname,'/app/views'));
//
// app.use(express.static(path.join(__dirname, '/public')));
// app.use('/revision',revroutes);

//connect to local mongo db - change this to ur local db uri
app.listen(3000, function () { //once were connected to db, then we start listening
    console.log('Revision app listening on port 3000!')
});


app.set('view engine', 'pug')
app.set('views', 'app/views')
app.use('/', routes);

// router.get('/page/login',function(req,res){
//     res.sendFile(path.join(__dirname+'/login.pug'));
//   });

app.use(express.static(path.join(__dirname, '/public')));

conn.collection("phonelistings").updateMany(
    {"brand": "Apple"},
    {$set: {"image" : "/phone_default_images/Apple.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "BlackBerry"},
    {$set: {"image" : "/phone_default_images/BlackBerry.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "HTC"},
    {$set: {"image" : "/phone_default_images/HTC.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "Huawei"},
    {$set: {"image" : "/phone_default_images/Huawei.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "LG"},
    {$set: {"image" : "/phone_default_images/LG.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "Motorola"},
    {$set: {"image" : "/phone_default_images/Motorola.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "Samsung"},
    {$set: {"image" : "/phone_default_images/Samsung.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "Nokia"},
    {$set: {"image" : "/phone_default_images/Nokia.jpeg"}});

conn.collection("phonelistings").updateMany(
    {"brand": "Sony"},
    {$set: {"image" : "/phone_default_images/Sony.jpeg"}});

module.exports = app;

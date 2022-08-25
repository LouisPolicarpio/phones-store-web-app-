let mongoose = require("mongoose");

/**
 * Ensure local db is called compDB or change in dbURI
 * @type {string}
 */
let dbURI = 'mongodb://localhost:27017/comp-db';
let db = mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true} )
    .catch((err) => console.log(err));

let conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));




module.exports = conn;
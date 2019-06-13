const mongoose = require("mongoose");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URI;
const dbName = "ptbot"
const db = mongoose.connection
mongoose.connect(url, { userNewUrlParser: false})

var User = require("../models/user-model")

// CREATE DATABASE

// Drop seeding 
db.once('open', () => {
  db.dropCollection("users", (err, res) => {
    if (err) throw err
    console.log("Dropped")
  })
})

MongoClient.connect(url, function(err, client) {
  if (err) throw err;

  let dbo = client.db(dbName)
  
  user = new User();

  (user.username = "john"),
  (user.password = "test"),
  
  dbo.collection("users").insertMany([user], (err, res) => {
    if (err) throw err;
    console.log("Number of Users created " + res.insertedCount)
    client.close();
  })
  
  client.close();
  console.log("Database created!");
});



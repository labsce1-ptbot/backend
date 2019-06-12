const mongoose = require("mongoose");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URI;
const dbName = "ptbot"
const db = mongoose.connection
mongoose.connect(url, { useNewUrlParser: false });

// CREATE DATABASE

// Drop seeding
db.once('open', () => {
  db.dropCollection("Users", (err, res) => {
    if (err) throw err
    console.log("Dropped")
  })
})

MongoClient.connect(url, function(err, client) {
  if (err) throw err;

  
  let seedUsers = [
    {username: "thumpthump", password: "ice"},
    {username: "lily", password: "rose"},
    {username: "mike", password: "fire"}
  ]
  
  let dbo = client.db(dbName)

  dbo.collection("Users").insertMany(seedUsers, (err, res) => {
    if (err) throw err;
    console.log("Number of Users created " + res.insertedCount)
    client.close();
  })
  
  client.db(dbName)
  client.close();
  console.log("Database created!");
});



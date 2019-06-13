const mongoose = require("mongoose");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URI;
const dbName = "ptbot"
const db = mongoose.connection
const seeder = require("mongoose-seed")


// Remember to remove later
mongoose.connect(url)

// CREATE DATABASE
var data = [
  {
  model: "User",
  documents: [
    {username: "john", password: "test"},
    {username: "alice", password: "test"},
    {username: "frank", password: "test"},
    {username: "greeny", password: "test"},
    {username: "spottyottydopalicious", password: "test"}
  ]
 }
]

// Seed
  seeder.connect(url, () => {
    seeder.loadModels(['../models/user-model.js'])
  
    seeder.clearModels(['User'], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect()
      })
    })
  })

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  
  let dbo = client.db(dbName)
  
  client.close();
  console.log("Database created!");
});



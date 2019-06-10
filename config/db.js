const mongoose = require("mongoose");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URI;
mongoose.connect(url, { useNewUrlParser: true });

//CREATE DATABASE
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

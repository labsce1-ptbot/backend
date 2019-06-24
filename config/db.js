const mongoose = require("mongoose");

require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URI;

const dbName = "ptbot";
const db = mongoose.connection;
// const seeder = require("mongoose-seed");

// Remember to remove later
mongoose.connect(url);

// CREATE DATABASE
// var data = [
//   {
//     model: "User",
//     documents: [
//       {
//         username: "john",
//         password: "test",
//         first_name: "Test",
//         last_name: "Test",
//         email: "test@gmail.com",
//         picture: null
//       },
//       {
//         username: "alice",
//         password: "test",
//         first_name: "Test",
//         last_name: "Test",
//         email: "test1@gmail.com",
//         picture: null
//       },
//       {
//         username: "frank",
//         password: "test",
//         first_name: "Test",
//         last_name: "Test",
//         email: "test2@gmail.com",
//         picture: null
//       },
//       {
//         username: "greeny",
//         password: "test",
//         first_name: "Test",
//         last_name: "Test",
//         email: "test3@gmail.com",
//         picture: null
//       },
//       {
//         username: "spottyottydopalicious",
//         password: "test",
//         first_name: "Test",
//         last_name: "Test",
//         email: "test4@gmail.com",
//         picture: null
//       }
//     ]
//   }
// ];

// Seed
// seeder.connect(url, () => {
//   seeder.loadModels(["../models/user-model.js"]);

//   seeder.clearModels(["User"], () => {
//     seeder.populateModels(data, () => {
//       seeder.disconnect();
//     });
//   });
// });

// MongoClient.connect(url, function(err, client) {
//   if (err) throw err;

//   let dbo = client.db(dbName);

//   client.close();
//   console.log("Database created!");
// });

// const dbName = "ptbot";
// const db = mongoose.connection;
// const seeder = require("mongoose-seed");

// // Remember to remove later
// mongoose.connect(url);

// // // CREATE DATABASE
// // var data = [
// //   {
// //   model: "User",
// //   documents: [
// //     {username: "john", password: "test", first_name: "Test", last_name: "Test", email: "test@gmail.com", picture: null},
// //     {username: "alice", password: "test", first_name: "Test", last_name: "Test", email: "test1@gmail.com", picture: null},
// //     {username: "frank", password: "test", first_name: "Test", last_name: "Test", email: "test2@gmail.com", picture: null},
// //     {username: "greeny", password: "test", first_name: "Test", last_name: "Test", email: "test3@gmail.com", picture: null},
// //     {username: "spottyottydopalicious", password: "test", first_name: "Test", "last_name": "Test", email: "test4@gmail.com", picture: null}
// //   ]
// //  }
// // ]

// // // Seed
// // seeder.connect(url, () => {
// //     seeder.loadModels(['../models/user-model.js'])

// //     seeder.clearModels(['User'], () => {
// //       seeder.populateModels(data, () => {
// //         seeder.disconnect()
// //       })
// //     })
// //   })

// // MongoClient.connect(url, function(err, client) {
// //   if (err) throw err;

// //   let dbo = client.db(dbName)

// //   client.close();
// //   console.log("Database created!");
// // });

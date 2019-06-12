const cache = require("../models/cache");
const cron = require("node-cron");
const express = require("express");
const router = express.Router();
const db = require("../routers/routers");

module.exports = function() {

// Deleting users that is not on vacation from database.

// Collecting users from database that is on vacation, runs at 12:01am.    
cron.schedule("01 00 * * *", () => {
    console.log("-------------------------\n");
    console.log("Collecting data from database and saving to cache.js\n");
    const database = db.get_date();
    database.forEach(obj => {
        cache[obj.slackID] = {
            "start_date" : obj.startDate,
            "end_date" : obj.endDate,
            "message" : obj.message,
            "vacation" : true
        }
    })
    console.log("------------------------\n");
    console.log("End results of what's in cache.js:", cache);
})

// Testing
cron.schedule("* * * * *", () => {
    console.log("-------------------------\n");
    console.log("Collecting data from database and saving to cache.js\n");
    const database = db.get_date();
    database.forEach(obj => {
        cache[obj.slackID] = {
            "start_date" : obj.startDate,
            "end_date" : obj.endDate,
            "message" : obj.message,
            "vacation" : true
        }
    })
    console.log("------------------------\n");
    console.log("End results of what's in cache.js:", cache);
})


};
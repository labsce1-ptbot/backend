const cache = require("../models/cache");
const cron = require("node-cron");
const express = require("express");
const router = express.Router();
const db = require("../routers/routers");

module.exports = function() {

// Deleting users that is not on vacation from database.

// Collecting users from database that is on vacation.    
cron.schedule("01 00 * * *", () => {
    console.log("-------------------------\n");
    console.log("Collecting data from database\n");
    const database = db.get_date()
})



};
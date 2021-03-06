const cache = require("../models/cache");
const cron = require("node-cron");
// Just in case needing to export, this can be uncommented
// const express = require("express");
// const router = express.Router();
const db = require("../routers/routers");

module.exports = function() {
  // Deleting users that is not on vacation from database.

  // Collecting users from database that is on vacation, runs at 12:01am.
  cron.schedule("30 00 * * *", async () => {
    console.log("-------------------------\n");
    console.log("Collecting data from database and saving to cache.js\n");
    const database = await db.get_date();
    database.forEach(obj => {
      (cache[obj.slackID] = {
        start_date: obj.startDate,
        end_date: obj.endDate,
        message: obj.message,
        vacation: true
      }),
        {
          scheduled: true
        };
    });
    console.log("------------------------\n");
    console.log("End results of what's in cache.js:", cache);
  });
};

/*
    Each index representation
     * * * * * *
     | | | | | |
     | | | | | day of week
     | | | | month
     | | | day of month
     | | hour
     | minute
     second ( optional )

*/

cron.schedule(
  "00 00 00 * * *",
  async () => {
    const delete_old = await db.clean_old_vacations();
  },
  {
    scheduled: true,
    timezone: "America/New_York"
  }
);

cron.schedule(
  "00 1 00 * * *",
  async () => {
    console.log("Collecting data from database and saving to cache.js\n");
    const database = await db.get_date();
    // console.log("---->----db cache---->", database);
    database.forEach(obj => {
      cache[obj.slackID] = {
        start_date: obj.startDate,
        end_date: obj.endDate,
        message: obj.message,
        vacation: true,
        team: obj.teamID
      };
    });
  },
  {
    scheduled: true,
    timezone: "America/New_York"
  }
);

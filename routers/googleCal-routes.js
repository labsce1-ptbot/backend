const axios = require("axios");
const request = require("request");
const User = require("../models/user-model");
const moment = require("moment");

require("dotenv").config();

module.exports = {
  add_to_google: async event => {
    const { email, start_date, end_date, id } = event;

    const user = await User.findOne({
      _id: id
    });

    console.log("-----Googel cal route user", user);
    const url = `https://www.googleapis.com/calendar/v3/calendars/${email}/events`;

    let data = {
      end: {
        date: moment(end_date).format("YYYY-MM-DD")
      },
      start: {
        date: moment(start_date).format("YYYY-MM-DD")
      },
      summary: "Vacation"
    };

    let options = {
      url: url,
      headers: {
        Authorization: `Bearer ${user.google_access_token}`,
        key: process.env.GOOGLE_API_KEY
      },
      json: true,
      body: data
    };

    request.post(options, (err, httpResonse, body) => {
      console.log("body--gCal------------\n>", body);

      // console.log("err--gCal--------------------\n>", err);
      // console.log("http--gCal--------------\n>", httpResonse);
    });
  }
};

// POST https://www.googleapis.com/calendar/v3/calendars/[CALENDARID]/events?key=[YOUR_API_KEY] HTTP/1.1

// Authorization: Bearer[YOUR_ACCESS_TOKEN]
// Accept: application / json
// Content - Type: application / json

// {
//     "end": {
//         "date": "2019-07-07"
//     },
//     "start": {
//         "date": "2019-06-06"
//     }
// }

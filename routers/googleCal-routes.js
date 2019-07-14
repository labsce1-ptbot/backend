const axios = require("axios");
const request = require("request");
require("dotenv").config();
module.exports = {
  add_to_google: async event => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/vacaybot1@gmail.com/events`;
    const { email, start_date, end_date } = event;

    let data = {
      end: {
        date: "2019-11-10"
      },
      start: {
        date: "2019-10-10"
      }
    };

    let options = {
      url: url,
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_AUTH_TOKEN}`,
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

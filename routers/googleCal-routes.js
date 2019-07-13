const axios = require("axios");
require("dotenv").config();
const url = "https://www.googleapis.com/calendar/v3/calendars";
module.exports = {
  add_to_google: async event => {
    const { email, start_date, end_date } = event;
    console.log("hey");
    const newEvent = {
      end: {
        date: "2019-09-09"
      },
      start: {
        date: "2019-08-08"
      },
      title: "vacation"
    };

    const z = {
      headers: {
        Authorizaition: "Bearer "
      }
    };
    const u = await axios.post(
      `${url}/${email}/events?key=${process.env.GOOGLE_API_KEY}&Authorization:${
        process.env.Auth_token
      }`,
      newEvent
    );
    console.log("u", u);
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

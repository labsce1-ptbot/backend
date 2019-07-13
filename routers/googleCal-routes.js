const axios = require("axios");
const request = require("request");
require("dotenv").config();
const url =
  "https://www.googleapis.com/calendar/v3/calendars/vacaybot1@gmail.com/events";
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
      }
    };

    const z = {
      headers: {
        Authorizaition: "Bearer "
      }
    };
    request.post(
      `${url}`,
      {
        headers: {
          Authorization: `Bearer ya29.GltFB7u1q0GYdOXDoJ1O0jSpn8_O1A4jax9kyvn9iEnQNObYnCh-Inb3GC4RP_0_KgAb9Pfu9tUawfAkSXlVjBlx6d5rMr4YPTZIEqyfrjk3txVKyV14JzSgXTDW`
        }
      },
      {
        body: {
          end: {
            date: "2019-09-09"
          },
          start: {
            date: "2019-08-08"
          }
        }
      },

      (err, httpResonse, body) => {
        console.log("body--gCal------------\n>", JSON.parse(body));
        // console.log("err--gCal--------------------\n>", err);
        // console.log("http--gCal--------------\n>", httpResonse);
      }
    );
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

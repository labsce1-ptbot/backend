const axios = require("axios");
const request = require("request");
const User = require("../models/user-model");
const moment = require("moment");
const Slack = require("../models/slack-model");

require("dotenv").config();

module.exports = googleRoutes = {
  add_to_google: async event => {
    const { email, start_date, end_date, id } = event;

    const user = await User.findOne({
      _id: id
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${email}/events`;

    let data = {
      end: {
        date: moment(end_date)
          .add(1, "days")
          .format("YYYY-MM-DD")
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

    if (user.google_access_token !== null) {
      request.post(options, (err, httpResonse, body) => {
        console.log("body--gCal------------\n>", body);
        if (body.error) {
          refreshAccess(event, user);
        }

        // console.log("err--gCal--------------------\n>", err);
        // console.log("http--gCal--------------\n>", httpResonse);
      });
    }
  },

  slackVacationHelper: async event => {
    const slack_id = await Slack.findOne({
      slackId: event.userID,
      team_id: event.teamID
    });

    const user = await User.findOne({
      slack: {
        _id: slack_id._id
      }
    });

    googleObj = {
      email: user.email,
      start_date: event.start_date,
      end_date: event.end_date,
      id: user._id
    };

    if (user.google_access_token !== null) {
      googleRoutes.add_to_google(googleObj);
    } else {
      return;
    }
  }
};

const refreshAccess = async (event, user) => {
  let url = `https://www.googleapis.com/oauth2/v4/token?refresh_token=${
    user.google_refresh_token
  }&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${
    process.env.GOOGLE_CLIENT_SECRET
  }&grant_type=refresh_token`;
  await request.post(url, async (err, httpResponse, body) => {
    let data = JSON.parse(body);

    const updatedUser = await User.updateOne(
      { _id: user._id },
      { google_access_token: data.access_token }
    );
    console.log("----->------", updatedUser);
    if (updatedUser.n === 1) {
      googleRoutes.add_to_google(event);
    }
  });
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

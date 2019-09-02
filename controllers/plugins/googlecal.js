const { google } = require("googleapis");
require("dotenv").config();
const request = require("request");
const User = require("../../routers/routers");

module.exports = function(botkit) {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "googlecal.js",
    // initialize this module. called at load time.
    init: function(controller) {
      function googleRoutes(req, res, next) {
        controller.webserver.get("/googlecal/user", (req, res) => {
          const scope =
            "https://www.googleapis.com/auth/calendar.events&https://www.googleapis.com/auth/calendar";
          // Remember to add scopes for calendar later
          let url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&prompt=consent&response_type=code&redirect_uri=http://localhost:3000/googlecal/code&client_id=${process.env.GOOGLE_CLIENT_ID}&include_granted_scopes=true&access_type=offline`;
          request.get(url, (err, httpResponse, body) => {
            res.send(body);
          });
        });

        controller.webserver.get("/googlecal/code", (req, res) => {
          let user;
          console.log("|---User info from Passport---|\n", req);
          if (req.isAuthenticated()) {
            user = req.user;
          }
          console.log("|---User info from Passport---|\n", user);
          let userId = user[0]._id;
          console.log("|---UserId--|\n", userId);
          console.log("|---Code---|\n", req.query.code);
          let code = req.query.code;
          let url = `https://www.googleapis.com/oauth2/v4/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=http://localhost:3000/googlecal/code&grant_type=authorization_code`;
          request.post(url, (err, httpResponse, body) => {
            let data = JSON.parse(body);
            let accessToken = data.access_token;
            let refresh = data.refresh_token ? data.refresh_token : null;
            User.addToken(userId, accessToken, refresh);

            console.log("|---Body Response Redirect Google---|\n", data);
            res.redirect(
              "http://localhost:3001/admin/vacations" ||
                `${process.env.ORIGIN}/admin/vacations`
            );
          });
        });

        controller.webserver.get("/googlecal/calendar", (req, res) => {
          let user;
          if (req.isAuthenticated()) {
            user = req.user;
          }
          console.log("|--- user info calendar ---|\n", user);
          // let calendarId = req.user[0].email
          // let url =  `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`
          // request.get(url, (err, httpResponse, body) => {
          //   console.log(body)
          // })
        });
        next();
      }
      controller.webserver.use("/googlecal", googleRoutes);
    }
  };
};

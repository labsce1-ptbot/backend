const { google } = require("googleapis");
require("dotenv").config();
const request = require("request");

module.exports = function(botkit) {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "googlecal.js",
    // initialize this module. called at load time.
    init: function(controller) {
      controller.webserver.get("/googlecal/user", (req, res) => {
        // Remember to add scopes for calendar later 
        let url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&
        access_type=offline&approval_prompt=force&response_type=code&redirect_uri=http://localhost:3000/googlecal/code&client_id=${
          process.env.GOOGLE_CLIENT_ID
        }&include_granted_scopes=true`;
        request.get(url, (err, httpResponse, body) => {
          res.send(body);
        });
      });

      controller.webserver.get("/googlecal/code", (req, res) => {
        console.log("|---Code---|\n", req.query.code)
        let code = req.query.code
        let url = `https://www.googleapis.com/oauth2/v4/token?code=${
          code
        }&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${
          process.env.GOOGLE_CLIENT_SECRET
        }&redirect_uri=http://localhost:3000/googlecal/code&grant_type=authorization_code`
        request.post(url, (err, httpResponse, body) => {
          let data = JSON.parse(body)
          console.log("|---Body Response Redirect Google---|\n", data)
        })
      });

    }
  };
};

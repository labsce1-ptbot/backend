const request = require('request')

module.exports = function(botkit) {
  return {
     // The name of the plugin. Used to log messages at boot time.
     name: "googlecal.js",
     // initialize this module. called at load time.
  init: function(controller) {

    controller.webserver.get("/googlecal/user", (req, res) => {
      // let url = `https://www.googleapis.com/calendar/v3/users/me/calendarList/randycweb@gmail.com`

      console.log("|---REQ---|", req)
      console.log("|---RES---|", res)
      request.get(url, (err, httpResponse, body) => {
        console.log(body)
      })
    })
    // add a web route
    controller.webserver.use("/googlecal", authRoutes);
  }
  }
}
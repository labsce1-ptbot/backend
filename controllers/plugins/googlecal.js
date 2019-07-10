module.exports = function(botkit) {
  return {
     // The name of the plugin. Used to log messages at boot time.
     name: "googlecal.js",
     // initialize this module. called at load time.
  init: function(controller) {

    // add a web route
    controller.webserver.use("/googlecal", authRoutes);
  }

  }
}
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const sessionMiddleWare = require("../../config/session");

module.exports = function(botkit) {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "session.js",
    // initialize this module. called at load time.
    init: function(controller) {
      // add a web route
      controller.webserver.use(sessionMiddleWare(controller));
    }
  };
};

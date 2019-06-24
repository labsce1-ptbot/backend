const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const sessionMiddleWare = require("../../config/session");

module.exports = function(botkit) {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "sessionMiddleWare.js",
    // initialize this module. called at load time.
    init: function(controller) {
      // add a web route
      controller.webserver.use(sessionMiddleWare(controller));

      // can also define normal handlers
      // controller.on('event', async(bot, message) => { ... });
    }
    // Any middlewares that should be automatically bound
    // Can include more than 1 of each kind.
    // middleware: {
    //     ingest: [
    //         (bot, message, next) => { next(); }
    //     ],
    //     receive: [
    //         (bot, message, next) => { next(); }
    //     ],
    //     send: [
    //         (bot, message, next) => { next(); }
    //     ]
    // },
    // this method will live at controller.plugins.myplugin.customMethod()
    // customMethod: async() => {}
  };
};

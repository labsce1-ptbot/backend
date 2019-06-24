const NodeCron = require("../../config/node-con");
const botkitRouter = require("../../routers/botkitRouter");
const bodyParser = require("body-parser");
const users = require("../../models/user-model");
const userRoutes = require("./usersRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");

module.exports = function(botkit) {
  // NodeCron();
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "Server.js",

    // initialize this module. called at load time.
    init: function(controller) {
      // do things like:

      // expose the methods from this plugin as controller.plugins.myplugin.<method>
      // controller.addPluginExtension('myplugin', this);

      // make locally bundled content public on the webservice:
      // controller.publicFolder('/public/myplugin', __dirname + '/public);

      // add a web route
      controller.webserver.get("/myplugins", async (req, res) => {
        res.send("Hello World");
      });

      // controller.webserver.use("/api/messages", botkitRouter);

      controller.webserver.use("/users", userRoutes);

      controller.webserver.use(
        bodyParser.urlencoded({
          limit: "50mb",
          extended: true,
          parameterLimit: 50000
        })
      );

      controller.webserver.use(
        bodyParser.json({ limit: "50mb", extended: true })
      );

      // controller.webserver.use(
      //   cors({
      //     origin: process.env.ORIGIN || "http://localhost:3000",
      //     credentials: true
      //   }),
      //   helmet(),
      //   session({
      //     secret: process.env.secret,
      //     saveUninitialized: true,
      //     resave: true
      //   }),
      //   passport.initialize(),
      //   passport.session()
      // );

      console.log(controller);

      controller.webserver.get("/users", (req, res) => {
        users.find({}, (err, users) => {
          res.send(users);
        });
      });
    }
  };
};

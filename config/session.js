const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");

module.exports = controller => {
  controller.webserver.use(
    express.json(),
    cors({
      origin: "http://localhost:3001" || process.env.ORIGIN,
      credentials: true
    }),
    helmet(),
    session({
      secret: process.env.secret,
      saveUninitialized: false,
      resave: false
    }),
    passport.initialize(),
    passport.session()
  );
};

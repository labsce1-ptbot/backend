const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const passport = require('passport')
const session = require('express-session')

module.exports = app => {
  app.use(
    express.json(),
    cors({
      origin: process.env.ORIGIN || "https://8c699a1b.ngrok.io",
      credentials: true
    }),
    helmet(),
    session({
      secret: process.env.secret,
      saveUninitialized: true,
      resave: true,
    }),
    passport.initialize(),
    passport.session()
  )
}
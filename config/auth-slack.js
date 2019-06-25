const express = require("express");
const SlackStrategy = require("passport-slack").Strategy;
const passport = require("passport");
const request = require("request");

const router = express.Router();

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      scope: [
        "identity.basic",
        "identity.email",
        "identity.avatar",
        "identity.team"
      ]
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
    }
  )
);

// router.get("/user", (req, res) => {
//   let url = "https://slack.com/api/auth.test"
//   request.post(url, {'auth': { 'bearer': `${process.env.authToken}` }},(err, httpResponse, body) => {
//     console.log(httpResponse.body)
//   })
// })

// https://slack.com/oauth/authorize?clientid=651818658071.649469653572?scope=identity.basic
router.get("/user", (req, res) => {
  let url = `https://slack.com/oauth/authorize?client_id=${
    process.env.clientId
  }&scope=identity.basic`;
  request.get(url, (err, httpResponse, body) => {
    res.send(body);
  });
});

router.get("/test", (req, res) => {
  console.log("Hello");
});

passport.serializeUser((profile, done) => done(null, profile));
passport.deserializeUser((profile, done) => done(null, profile));

router.get("/", passport.authenticate("slack"), (req, res) => {
  console.log(req);
});

// OAuth callback url
router.get(
  "/slack/callback",
  passport.authenticate("Slack", {
    successRedirect: "http://localhost:3000/test",
    failureRedirect: "http://localhost:3000/failure"
  }),
  (req, res) => console.log("Hey")
);

module.exports = router;

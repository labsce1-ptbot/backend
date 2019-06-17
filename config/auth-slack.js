const express = require('express');
const passport = require('passport')
const SlackStrategy = require('passport-slack').Strategy

const router = express.router()

const slackStrategy = new SlackStrategy({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret),
  (accessToken, refreshToken, profile, done) => {
    done(null, profile)
  }
})

passport.use(slackStrategy)

router.get('/slack', passport.authorize('slack'));
 
// OAuth callback url
router.get('/slack/callback', 
  passport.authorize('slack', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

module.exports = router
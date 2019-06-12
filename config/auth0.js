const express = require('express')
const router = express.Router();
const path = require("path")

require("dotenv").config({path: path.resolve(__dirname, '../.env')})

const Auth0Strategy = require('passport-auth0')
const passport = require('passport')

const params = (accessToken, refreshToken, extraParams, profile, done) => {
  return done(null, profile)
} 

passport.use(
  new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }, params)
)

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  }
);
 
router.get('/login',
  passport.authenticate('auth0', {}), function (req, res) {
  res.redirect("/");
});

module.exports = router
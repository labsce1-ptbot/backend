const express = require('express')
const router = express.Router();
const path = require("path")

require("dotenv").config({path: path.resolve(__dirname, '../.env')})

const Auth0Strategy = require('passport-auth0')
const passport = require('passport')

const params = (accessToken, refreshToken, extraParams, profile, done) => {
  console.log(profile)
  return done(null, profile)
} 

/* Example of profile 
Profile {
  displayName: 'Randy Calderon',
  id: 'google-oauth2|104938778787389789491',
  user_id: 'google-oauth2|104938778787389789491',
  name: { familyName: 'Calderon', givenName: 'Randy' },
  emails: [ { value: 'randycweb@gmail.com' } ],
  picture:
   'https://lh4.googleusercontent.com/--LQWuGMQx4w/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3re9YnO8YbaWPcaPjCU-9WjZGWvt_A/mo/photo.jpg',
  locale: 'en',
  nickname: 'randycweb',
  _json:
   { sub: 'google-oauth2|104938778787389789491',
     given_name: 'Randy',
     family_name: 'Calderon',
     nickname: 'randycweb',
     name: 'Randy Calderon',
     picture:
      'https://lh4.googleusercontent.com/--LQWuGMQx4w/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3re9YnO8YbaWPcaPjCU-9WjZGWvt_A/mo/photo.jpg',
     locale: 'en',
     updated_at: '2019-06-14T14:14:21.113Z',
     email: 'randycweb@gmail.com',
     email_verified: true },
  _raw:
   '{"sub":"google-oauth2|104938778787389789491","given_name":"Randy","family_name":"Calderon","nickname":"randycweb","name":"Randy Calderon","picture":"https://lh4.googleusercontent.com/--LQWuGMQx4w/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3re9YnO8YbaWPcaPjCU-9WjZGWvt_A/mo/photo.jpg","locale":"en","updated_at":"2019-06-14T14:14:21.113Z","email":"randycweb@gmail.com","email_verified":true}' }
   */

passport.use(
  new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }, params)
)

passport.serializeUser((profile, done) => done(null, profile))
passport.deserializeUser((profile, done) => done(null, profile))

router.get('/callback',
  passport.authenticate('auth0', { successRedirect: 'http://localhost:5000/logged', failureRedirect: 'http://localhost:5000/failure' },
  ),
);
 
router.get('/login',
  passport.authenticate('auth0', {}), function (req, res) {
  res.redirect("/logged");
});

module.exports = router
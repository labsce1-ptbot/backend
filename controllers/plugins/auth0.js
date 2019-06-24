const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../../routers/routers");

const Auth0Strategy = require("passport-auth0");
const passport = require("passport");

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
module.exports = function(controller) {
  // return {
  //   name: "auth0.js",
  //   init: function(controller) {
  passport.use(
    new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
      },
      async (accessToken, refreshToken, extraParams, profile, done) => {
        let user;
        profile.accessToken = accessToken;
        profile.refreshtoken = refreshToken;
        profile.expiresIn = extraParams.expires_in;
        profile.expires = moment().add(profile.expiresIn, "s");
        console.log(profile);
        try {
          user = await User.addUser(profile._json);
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((profile, done) => done(null, profile));
  passport.deserializeUser((profile, done) => done(null, profile));

  controller.get(
    "/callback",
    passport.authenticate("auth0", {
      successRedirect: "localhost:3000/logged",
      failureRedirect: "localhost:3000/failure"
    })
  );

  controller.get("/login", passport.authenticate("auth0", {}), function(
    req,
    res
  ) {
    res.redirect("/");
    console.log("Maybe?");
  });
  //   }
  // };
};
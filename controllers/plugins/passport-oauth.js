const moment = require("moment");
const User = require("../../routers/routers");
const Auth0Strategy = require("passport-auth0");
const passport = require("passport");
require("dotenv").config();
// const authRoutes = require("./auth0");

module.exports = function(botkit) {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "passport-oauth.js",
    // initialize this module. called at load time.
    init: function(controller) {
      function authRoutes(req, res, next) {
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
        ); // end of passport.use

        passport.serializeUser((profile, done) => done(null, profile));
        passport.deserializeUser((profile, done) => done(null, profile));

        controller.webserver.get(
          "/callback",
          passport.authenticate("auth0", {
            successRedirect: "localhost:3000/logged",
            failureRedirect: "localhost:3000/failure"
          })
        );

        controller.webserver.get(
          "/login",
          passport.authenticate("auth0", {}),
          function(req, res) {
            res.redirect("/");
          }
        );

        // log the requested url. handy for debugging!
        console.log("REQ: ", req.url);

        // call next or else the request will be intercepted
        next();
      }

      // add a web route
      controller.webserver.use("/auth", authRoutes);

      //   controller.webserver.get(
      //     "auth/callback",
      //     passport.authenticate("auth0", {
      //       successRedirect: "localhost:3000/logged",
      //       failureRedirect: "localhost:3000/failure"
      //     })
      //   );

      //   controller.webserver.get(
      //     "auth/login",
      //     passport.authenticate("auth0", {}),
      //     function(req, res) {
      //       console.log("we got something here");
      //       res.redirect("/");
      //     }
      //   );

      controller.webserver.get("/logged", (req, res) => {
        res.send("Successfully Worked as far as authenticating");
      });

      controller.webserver.get("/failure", (req, res) => {
        res.send("Failure to authenticate");
      });

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
    }
  };
};

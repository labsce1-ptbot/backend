const moment = require("moment");
const User = require("../../routers/routers");
const Auth0Strategy = require("passport-auth0");
const passport = require("passport");
require("dotenv").config();

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
              profile.refreshToken = refreshToken;
              profile.expiresIn = extraParams.expires_in;
              profile.expires = moment().add(profile.expiresIn, "s");
              console.log("<------=-=-=-= PROFILE =-=-=-=-=-=---->\n", profile);
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
          "/auth/callback",
          passport.authenticate("auth0", {
            successRedirect:
              "http://localhost:3001/admin/dashboard" ||
              `${process.env.REACT_APP_SERVER_URL}`,
            failureRedirect: "/"
          })
        );

        controller.webserver.get(
          "/auth/login",
          passport.authenticate("auth0", {
            //   successRedirect: "/",
            //   failureRedirect: "/auth/login"
            // })
            function(req, res) {
              res.redirect("/");
            }
          })
        );

        // Make sure session is ended on logout
        controller.webserver.post("/auth/logout", (req, res) => {
          req.logout();
          // req.session.destroy(() => {
          //   res.clearCookie("connect.sid", { domain: "localhost", path: "/" });
          //   res.status(301).send({ success: false });
          // });
          req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(301).send({ success: false });
          });
        });

        // log the requested url. handy for debugging!
        console.log("REQ: ", req.url);

        // call next or else the request will be intercepted
        next();
      }

      // add a web route
      controller.webserver.use("/auth", authRoutes);

      // controller.webserver.get("/logged", (req, res) => {
      //   res.send("Successfully Worked as far as authenticating");
      // });

      // controller.webserver.get("/failure", (req, res) => {
      //   res.send("Failure to authenticate");
      // });
    }
  };
};

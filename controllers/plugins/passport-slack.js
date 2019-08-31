const SlackStrategy = require("passport-slack-oauth2").Strategy;
const passport = require("passport");
const db = require("../../routers/routers");

module.exports = botkit => {
  return {
    name: "passport-slack.js",
    init: controller => {
      function testRoutes(req, res, next) {
        passport.use(
          new SlackStrategy(
            {
              clientID: process.env.clientId,
              clientSecret: process.env.clientSecret,
              scope: ["identity.basic", "identity.email", "identity.avatar"],
              callbackURL: `http://localhost:3000/test/slack/callback`
            },
            async (accessToken, refreshToken, profile, done) => {
              let user;
              console.log("--- Test Profile Slack Passport ---\n", profile);
              try {
                user = await db.testSlackAddUser(profile);
                return done(null, user);
              } catch (err) {
                return done(err, null);
              }
            }
          )
        );

        passport.serializeUser((profile, done) => done(null, profile));
        passport.deserializeUser((profile, done) => done(null, profile));

        controller.webserver.get(
          "/test/slack",
          passport.authenticate("Slack", (req, res) => {
            console.log("This route has been hit! Yes it exists");
          })
        );

        controller.webserver.get(
          "/test/slack/callback",
          passport.authenticate("Slack", { failureRedirect: "/" }),
          (req, res) => {
            res.redirect("http://localhost:3001/admin/dashboard");
          }
        );

        console.log("REQ: ", req.url);

        next();
      }
      controller.webserver.use("/test", testRoutes);
    }
  };
};

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
              scope: ["identity.basic", "identity.email", "identity.avatar"]
            },
            async (accessToken, refreshToken, profile, done) => {
              let user;
              console.log("----access", accessToken);
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
          passport.authenticate(
            "Slack",
            {
              successRedirect: "/test/success",
              failureRedirect: "/test/failure"
            }
            // () => console.log("Yo!")
          )
        );

        controller.webserver.get("/test/failure", (req, res) => {
          res.send("Failed Login");
        });

        controller.webserver.get(
          "/test/success",
          passport.authenticate("Slack"),
          (req, res) => {
            res.redirect(`${process.env.SLACK_REDIRECT}/admin/dashboard`);
          }
        );
        next();
      }
      controller.webserver.use("/test", testRoutes);
    }
  };
};

const SlackStrategy = require("passport-slack-oauth2").Strategy
const passport = require("passport")

module.exports = botkit => {
    return {
        name: "passport-slack.js",
        init: controller => {
            function testRoutes(req, res, next) {
                passport.use(
                    new SlackStrategy({
                        clientID: process.env.clientId,
                        clientSecret: process.env.clientSecret,
                        scope: ['identity.basic', 'identity.email', 'identity.avatar'],
                        skipUserProfile: false
                    }, (accessToken, refreshToken, profile, done) => {
                        console.log("--- Test Profile Slack Passport ---\n", profile)
                    }))

                controller.webserver.get("/test/slack", passport.authenticate("Slack", () => 
                    console.log("This route has been hit! Yes it exists")
                ))

                controller.webserver.get("/test/slack/callback", (req, res) => {
                    passport.authenticate("Slack", { failureRedirect: "/test/failure"}, () => console.log("Yo!"))
                })
                
                controller.webserver.get("/test/failure", (req, res) => {
                    res.send("Failed Login")
                })

                controller.webserver.get("/test/success", (req, res) => {
                    res.send("Success? Sure why not!")
                })
                next()
            }
            controller.webserver.use("/test", testRoutes)
        }
    }
}
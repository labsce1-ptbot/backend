const passport = require('passport')
const request = require('request')
const { ensureAuthenticated } = require("../../config/auth0mw")

module.exports = (botkit) => {
  return {
    // Plugin Name
    name: 'slack-auth',
    // Initialize module
    init: (controller) => {
      function slackAuthRoutes(req, res, next) {
        
        controller.webserver.get("/slack/user", (req, res) => {
          let url = `https://slack.com/oauth/authorize?client_id=${process.env.clientId}&scope=identity.basic identity.email`
          request.get(url,(err, httpResponse, body) => {
            res.send(body)
          })
        })
        
        
        controller.webserver.get("/slack/code",  (req, res) => {
          let user;
          if(req.isAuthenticated()) {
            user = req.user
          }
          console.log("|---User info from Passport---|\n", user)
          
          let code = req.query.code
          let url = `https://slack.com/api/oauth.access?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&code=${code}`
          request.get(url, (err, httpResponse, body) => {
            let data = JSON.parse(body)
            console.log("|---Slack Response----|\n", data)
            console.log(req.session)
            user.access_token = data.access_token
            console.log("|---Updated Req User with Token---|", user)
          })
          res.send("Got user data, exchange for token now")
      
        })

        controller.webserver.get('/slack/logout', (req, res) => {
          req.logout();
          res.redirect('/');
        });
        console.log('REQ:', req.url)
        
        next();
        } 
        controller.webserver.use('/slack', slackAuthRoutes);
      }
    }
  }

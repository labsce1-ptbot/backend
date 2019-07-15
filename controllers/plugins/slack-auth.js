const request = require('request')
const Slack = require('../../routers/routers')

module.exports = (botkit) => {
  return {
    // Plugin Name
    name: 'slack-auth.js',
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
            // data.user.id for slackId
            // Figure out how to manage token. Store in database or not?
            // req.session.passport.user.access_token = data.access_token
            Slack.slackInfo(data)
            console.log(`|---Updated Req User with Token---|`, user)
            req.session.save((err) => {console.log("|---Error on session save---|", err)})
          })
          res.redirect("http://localhost:3001/admin/vacations" || `${process.env.ORIGIN}/admin/vacations`)
        })

        
        controller.webserver.get('/slack/logout', (req, res) => {
          req.logout();
          res.redirect('/');
        });
        next();
        } 

        controller.webserver.use('/slack', slackAuthRoutes);
      }
    }
  }

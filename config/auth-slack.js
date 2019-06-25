// const express = require('express');
// const passport = require('passport')
// const request = require('request')

// const router = express.Router();


// // router.get("/user", (req, res) => {
// //   let url = "https://slack.com/api/auth.test"
// //   request.post(url, {'auth': { 'bearer': `${process.env.authToken}` }},(err, httpResponse, body) => {
// //     console.log(httpResponse.body)
// //   })
// // })

// // https://slack.com/oauth/authorize?clientid=651818658071.649469653572?scope=identity.basic
// router.get("/user", (req, res) => {
//   let url = `https://slack.com/oauth/authorize?client_id=${process.env.clientId}&scope=identity.basic`
//   request.get(url,(err, httpResponse, body) => {
//     res.send(body)
//   })
// })

// // Params you get back exchanged for token runs out in 10 minutes
// /* { code:
// combination of clientId along with hash that gets exchanged for token,
// state: '' }
// */

// /*
// We strongly recommend supplying the Client ID and Client Secret using the HTTP Basic authentication scheme, as discussed in RFC 6749.

// If at all possible, avoid sending client_id and client_secret as parameters in your request.
// */

// router.get("/code", (req, res) => {
//   let code = req.query.code
//   let url = `https://slack.com/api/oauth.access?client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&code=${code}`
//   request.get(url, (err, httpResponse, body) => {
//     console.log(body)
//   })
//   res.send("Got user data, exchange for token now")
// })

// router.get("/test", (req, res) => {
//   console.log("Hello")
// })

// passport.serializeUser((profile, done) => done(null, profile))
// passport.deserializeUser((profile, done) => done(null, profile))

// router.get('/', passport.authenticate('slack'), (req, res) => {
//   console.log(req)
// });
 
// // OAuth callback url
// router.get('/slack/callback', 
//   passport.authenticate('Slack', { successRedirect: "https://1e8070c2.ngrok.io/test", failureRedirect: 'https://1e8070c2.ngrok.io/failure' }),
//   (req, res) => console.log("Hey")
// );

// module.exports = router

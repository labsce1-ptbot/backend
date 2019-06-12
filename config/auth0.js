const Auth0Strategy = require('passport-auth0')
  passport = require('passport')

const strategy = new Auth0Strategy({
  domain: process.env.authUrl,
  clientId: process.env.authClientId,
  clientSecret: process.env.authClientSecret,
  callbackUrl: process.env.auth0CallBack
}, 
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile)
  }
)

passport.use(strategy)
// Import Botkit's core features
const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");
require("dotenv").config();
let db = require("./routers/routers");

// Importing custom plugins
let server = require("./controllers/plugins/server");
let passportOAuth = require("./controllers/plugins/passport-oauth");
let userRoutes = require("./controllers/plugins/user-routes");
let googleCal = require("./controllers/plugins/googlecal");
let testSlack = require("./controllers/plugins/passport-slack");
// Import a platform-specific adapter for slack.
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware
} = require("botbuilder-adapter-slack");

const { MongoDbStorage } = require("botbuilder-storage-mongodb");

// Load process.env values from .env file

let mongoStorage;
// let storage = database;
if (process.env.MONGO_URI) {
  mongoStorage = new MongoDbStorage({
    url: process.env.MONGO_URI,
    database: "vacation",
    collection: "vacation"
  });
}

const adapter = new SlackAdapter({
  // parameters used to secure webhook endpoint
  verificationToken: process.env.verificationToken,
  clientSigningSecret: process.env.clientSigningSecret,

  // credentials used to set up oauth for multi-team apps
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ["bot"],
  debug: true,
  redirectUri: `${process.env.AUTH_REDIRECT}/install/auth`,
  getBotUserByTeam: getBotUserByTeam,
  getTokenForTeam: getTokenForTeam
});

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  debug: true,
  webhook_uri: "/api/messages",
  adapter: adapter,
  storage: mongoStorage
});

if (process.env.cms_uri) {
  controller.usePlugin(
    new BotkitCMSHelper({
      cms_uri: process.env.cms_uri,
      token: process.env.cms_token
    })
  );
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(__dirname + "/controllers/features");

  // loading in custom plugins
  // controller.usePlugin(session);
  controller.usePlugin(server);
  controller.usePlugin(passportOAuth);
  controller.usePlugin(userRoutes);
  // controller.usePlugin(authSlack);
  controller.usePlugin(googleCal);
  controller.usePlugin(testSlack);
  controller.webserver.use(
    express.json(),
    cors({
      origin: process.env.ORIGIN,
      credentials: true
    }),
    helmet(),
    session({
      secret: process.env.secret,
      saveUninitialized: false,
      resave: false
    }),
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000
    }),
    bodyParser.json({ limit: "50mb", extended: true }),
    passport.initialize(),
    passport.session()
  );

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on("message,direct_message", async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});

controller.webserver.get("/install", (req, res) => {
  res.redirect(controller.adapter.getInstallLink());
});

controller.hears("hello", "message", async (bot, message) => {
  await bot.reply(message, "yo!");
});

controller.webserver.get("/install/auth", async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);

    console.log("FULL OAUTH DETAILS", results);

    // Store token by team in bot state.
    tokenCache[results.team_id] = results.bot.bot_access_token;

    // Capture team to bot id
    userCache[results.team_id] = results.bot.bot_user_id;
    let addedWorkspace = await db.newWorkspace(results);
    res.redirect(`https://app.slack.com/client/${results.team_id}`);
    // res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});

let tokenCache = {};
let userCache = {};

if (process.env.TOKENS) {
  tokenCache = JSON.parse(process.env.TOKENS);
}

if (process.env.USERS) {
  userCache = JSON.parse(process.env.USERS);
}

async function getTokenForTeam(teamId) {
  try {
    let workAuth = await db.getWorkspaceTeamID(teamId);

    if (tokenCache[teamId]) {
      return tokenCache[teamId];
    } else {
      tokenCache[teamId] = workAuth.bot_access_token;
      return workAuth.bot_access_token;
    }
  } catch (err) {
    console.error("Team not found in tokenCache: ", teamId);
  }
}

async function getBotUserByTeam(teamId) {
  try {
    if (userCache[teamId]) {
      return userCache[teamId];
    } else {
      await db.getWorkspaceTeamID(teamId).then(res => {
        userCache[teamId] = res.bot_user_id;
        tokenCache[teamId] = res.bot_access_token;
        return res.bot_user_id;
      });
    }
  } catch (err) {
    console.error("Team not found in userCache: ", err);
  }
}

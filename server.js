require("dotenv").config();

const SERVER_CONFIGS = require("./config/server_port.js");
const botkitRouter = require("./routers/botkitRouter");
const NodeCron = require("./config/node-con");
const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const sessionMiddleware = require("./config/session");
const compression = require("compression");

// Apply session middleware
sessionMiddleware(app);

// Apply compression
app.use(compression());

// For payloads
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

// Imported Routers

const slackRoutes = require('./config/auth-slack')
const auth0Routes = require('./config/auth0.js')
const userRoutes = require("./routers/users/usersRoutes")


// Models
const users = require("./models/user-model");

// Routes

app.use("/auth", auth0Routes)
app.use("/slack", slackRoutes)
app.use("/users", userRoutes)


// Initializing Middleware
app.use("/api/messages", botkitRouter);

// Initialize Node-cron to run when server starts.
NodeCron();

// Test endpoint to see if server is running
app.get("/", (req, res) => {
  console.log(req.query.code)
  res.send("Hello, World!");
});

// List All Users
app.get("/users", (req, res) => {
  users.find({}, (err, users) => {
    res.send(users);
  });
});

app.get("/logged", (req, res) => {
  res.send("Successfully Worked as far as authenticating");
});

// Remove later, used to check session is intact
app.get("/check", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});


// Make sure session is ended on logout 
app.get("/conf", (req, res) => {
  res.send("Logged out!")
})

app.get("/failure", (req, res) => {
  res.send("Failure to authenticate or authorize")
})

// Testing atm, Trying to get botkit to respond from port 5000
require("./routers/botkitRouter")(app);

// Port listener for server
app.listen(
  SERVER_CONFIGS.PRODUCTION ? SERVER_CONFIGS.PRODUCTION : SERVER_CONFIGS.PORT,
  error => {
    if (error) throw error;
    console.log(
      "Server running on port: " + SERVER_CONFIGS.PORT
        ? SERVER_CONFIGS.PORT
        : SERVER_CONFIGS.PRODUCTION
    );
  }
);

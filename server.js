require("dotenv").config();

const SERVER_CONFIGS = require("./config/server_port.js");
const botkitRouter = require("./routers/botkitRouter");
const NodeCron = require("./config/node-con");
const express = require('express');

const app = express();

const cors = require('cors')
const bodyParser = require('body-parser')
const sessionMiddleware = require('./config/session');
const options = 'http://localhost:3000'
const compression = require('compression')


// Apply session middleware
sessionMiddleware(app)

// Apply compression
app.use(compression())

// Cors
app.use(cors({origin: options}))

// For payloads
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)

// Imported Routers
const authRoutes = require('./config/auth0.js')

// Models
const users = require("./models/user-model")

// Routes
app.use("/auth", authRoutes)

// Initializing Middleware
app.use("/api/messages", botkitRouter);

// Initialize Node-cron to run when server starts.
NodeCron();

// Test endpoint to see if server is running
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// List All Users
app.get("/users", (req, res) => {
  users.find({}, (err, users) => {
    res.send(users)
  })
})

app.get("/logged", (req, res) => {
  res.send("Successfully Worked as far as authenticating")
})

app.get("/check", (req, res) => {
  console.log(req.user)
})

app.get("/failure", (req, res) => {
  res.send("Failure to authenticate")
})
// Testing atm, Trying to get botkit to respond from port 5000
require('./routers/botkitRouter')(app);

// Port listener for server
app.listen(SERVER_CONFIGS.PRODUCTION ? SERVER_CONFIGS.PRODUCTION : SERVER_CONFIGS.PORT, error => {
    if (error) throw error;
    console.log("Server running on port: " + SERVER_CONFIGS.PORT ? SERVER_CONFIGS.PORT : SERVER_CONFIGS.PRODUCTION);
  });

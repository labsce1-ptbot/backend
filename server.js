require("dotenv").config();

const SERVER_CONFIGS = require("./config/server_port.js");
const botkitRouter = require("./routers/botkitRouter");
const NodeCron = require("./config/node-con");
const express = require('express');

const app = express();

// Initializing Middleware
app.use("/api/messages", botkitRouter);

// Initialize Node-cron to run when server starts.
NodeCron();

// Test endpoint to see if server is running
app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

// Testing atm, Trying to get botkit to respond from port 5000
require('./routers/botkitRouter')(app);

// Port listener for server
app.listen(SERVER_CONFIGS.PRODUCTION ? SERVER_CONFIGS.PRODUCTION : SERVER_CONFIGS.PORT, error => {
    if (error) throw error;
    console.log("Server running on port: " + SERVER_CONFIGS.PORT ? SERVER_CONFIGS.PORT : SERVER_CONFIGS.PRODUCTION);
  });

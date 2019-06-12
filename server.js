require("dotenv").config();

const express = require('express');
const app = express();
const SERVER_CONFIGS = require("./config/server_port.js");
const botkitRouter = require("./routers/botkitRouter");
const url = process.env.MONGO_URI

// Initializing Middleware
app.use("/api/messages", botkitRouter);

// Test endpoint to see if server is running
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// Port listener for server
app.listen(SERVER_CONFIGS.PORT || 5000, error => {
    if (error) throw error;
    console.log("Server running on port: " + SERVER_CONFIGS.PORT);
  });

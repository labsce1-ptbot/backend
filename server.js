require("dotenv").config();

const express = require('express');
const app = express();
const SERVER_CONFIGS = require("./config/server_port.js");
const botkitRouter = require("./routers/botkitRouter");

const cors = require('cors')
const sessionMiddleware = require('./config/session');
const options = 'http://localhost:3000'
const compression = require('compression')

// Apply session middleware
sessionMiddleware(app)

// Apply compression
app.use(compression())

// Cors
app.use(cors({origin: options}))

// Imported Routers
const authRoutes = require('./config/auth0.js')

// Models
const users = require("./models/user-model")

// Routes
app.use("/auth", authRoutes)

// Initializing Middleware
app.use("/api/messages", botkitRouter);

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


// Port listener for server
app.listen(SERVER_CONFIGS.PORT || 5000, error => {
    if (error) throw error;
    console.log("Server running on port: " + SERVER_CONFIGS.PORT);
  });

const slack = require("../controllers/bot.js");
const express = require("express");
const router = express.Router();

module.exports = function(app) {
<<<<<<< HEAD
    app.post('/', function(req, res) {
        res.status(200);
=======
  router.post("/", function(req, res) {
    res.status(200);
>>>>>>> c5bb0b8c1c20d671516636f8f789dffa1000e8a3

    slack.controller.handleWebhookPayload(req, res);
  });
};

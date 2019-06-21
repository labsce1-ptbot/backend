const slack = require("../bot.js/index.js");
const express = require("express");
const router = express.Router();

module.exports = function(app) {
  router.post("/", function(req, res) {
    res.status(200);

    slack.controller.handleWebhookPayload(req, res);
  });
};

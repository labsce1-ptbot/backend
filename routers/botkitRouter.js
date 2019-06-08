const slack = require('../controllers/bot.js')
const express = require("express");
const router = express.Router();

module.exports = function(app) {
    app.post('/', function(req, res) {
        res.status(200);

        slack.controller.handleWebhookPayload(req, res)
    })

}
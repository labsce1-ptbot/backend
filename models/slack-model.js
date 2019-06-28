const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slackSchema = Schema({
  slackId: {
    type: String,
    required: true,
    unique: true,
  },
  team_id: {
    type: String,
    required: true,
    unique: true,
  },
  validated: {
    type: Boolean,
    required: true
  },
})

Slack = module.exports = mongoose.model("Slack", slackSchema)
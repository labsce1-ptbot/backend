const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  slackID: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now()
  },
  endDate: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

Event = module.exports = mongoose.model("Event", eventSchema);

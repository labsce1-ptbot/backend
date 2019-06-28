const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema({
  slackID: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    // default: Date.now()
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages"
    }
  ]
});

Event = module.exports = mongoose.model("Event", eventSchema);

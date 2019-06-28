const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = Schema({
  recipient: {
    type: String,
    require: false
  },
  custom_message: {
    type: String,
    required: true
  }
});

Messages = module.exports = mongoose.model("Messages", messagesSchema);

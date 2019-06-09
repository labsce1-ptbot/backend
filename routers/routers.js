const Event = require("../models/event-model");

function add_date(message) {
  event = new Event();
  (event.eventId = message.client_msg_id),
    (event.slackID = message.user),
    (event.endDate = Date.now()),
    (event.message = message.text);

  // event.find(message.user);
  event.save(function(err) {
    if (err) {
      console.log("error", err);
    } else {
      return "success";
    }
  });
}

module.exports = add_date;

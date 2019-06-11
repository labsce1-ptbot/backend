const Event = require("../models/event-model");

async function add_date(message) {
  event = new Event();
  (event.eventId = message.client_msg_id),
    (event.slackID = message.user),
    (event.endDate = Date.now()),
    (event.message = message.text);

  const dbResponse = await event.save();

  return dbResponse;
}

module.exports = add_date;

const Event = require("../models/event-model");

async function add_date(message) {
  console.log("<----------MESSAGE-------->\n", message);
  console.log("<----Date NOW---->\n", Date.now());
  event = new Event();
  // (event.eventId = message.client_msg_id),
    (event.eventId = "testingthisout"),
    (event.slackID = message.userID),
    (event.startDate = message.start_date),
    (event.endDate = message.end_date),
    (event.message = "message.text");

  console.log("<-----EVENT------>", event);
  const dbResponse = await event.save();

  return dbResponse;
}

module.exports = add_date;

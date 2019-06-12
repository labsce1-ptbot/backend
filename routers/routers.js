const Event = require("../models/event-model");
const db = require("../config/db");

async function add_date(message) {
  // console.log("<----------MESSAGE-------->\n", message);
  // console.log("<----Date NOW---->\n", Date.now());
  event = new Event();
  // (event.eventId = message.client_msg_id),
  // (event.eventId = "testingthisout"),
  (event.slackID = "UK760RYT0"),
    (event.startDate = "2019-06-16T15:09:47.624+00:00"),
    (event.endDate = "2019-06-25T14:53:47.704+00:00"),
    (event.message = "message.text");

  // console.log("<-----EVENT------>", event);

  let conflicts = await searchConflict(event);

  console.log("=======y======conflicts===", conflicts[0]);
  if (conflicts.length === 0) {
    return await event.save();
  } else {
    conflicts.push(event);
    conflicts.push("conflict");

    return conflicts;
  }
}

async function searchConflict(event) {
  const conflict_array = await Event.find({
    slackID: event.slackID,
    $or: [
      {
        startDate: { $gte: event.startDate, $lte: event.endDate },
        endDate: { $gte: event.startDate, $lte: event.endDate }
      }
    ]
  });

  console.log("=======conflict_array=========", conflict_array);
  return conflict_array;
}

module.exports = add_date;

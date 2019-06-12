const Event = require("../models/event-model");
const db = require("../config/db");

module.exports = {
  add_date: async message => {
    console.log("<----------MESSAGE-------->\n", message);
    console.log("<----Date NOW---->\n", Date.now());
    event = new Event();

    (event.slackID = message.userID),
      (event.startDate = message.start_date),
      (event.endDate = message.end_date),
      (event.message = "message.text");

    let conflicts = await searchConflict(event);
    if (conflicts.length === 0) {
      return await event.save();
    } else {
      conflicts.push(event);
      conflicts.push("conflict");

      return conflicts;
    }
  },
  get_date: async () => {
    console.log("<---- GET Date NOW---->\n");
    const y = await Event.find({
      startDate: { $lte: Date.now() },
      endDate: { $gte: Date.now() }
    });
    return y;
  },

  searchConflict: async event => {
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
  },

  showAll: async message => {
    console.log(message.user);
    const all_msgs = await Event.find({
      slackID: message.user
    });
    console.log(all_msgs);
    return all_msgs;
  }
};

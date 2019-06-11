const Event = require("../models/event-model");

module.exports = {
  add_date : async (message) => {
    console.log("<----------MESSAGE-------->\n", message);
    console.log("<----Date NOW---->\n", Date.now());
    event = new Event();
    (event.slackID = message.userID),
    (event.startDate = message.start_date),
    (event.endDate = message.end_date),
    (event.message = "message.text");

    const dbResponse = await event.save();

    return dbResponse;
  },
  get_date : async () => {
    console.log("<---- GET Date NOW---->\n");
    const y = await Event.find({
        startDate : {$lte : Date.now()}, endDate : {$gte : Date.now()}
    });    
    return y;
  },

}

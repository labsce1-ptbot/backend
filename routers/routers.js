const Event = require("../models/event-model");
const bot = require("../controllers/bot");

module.exports = {
  add_date : async (message) => {
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
  },
  get_date : async () => {
    // console.log("<----------MESSAGE-------->\n", message);
    console.log("<---- GET Date NOW---->\n");
    const y = await Event.find({
      // slackID: event.slackID,
      // $or: [
        // {
        //   startDate: { $gte: event.startDate, $lte: event.endDate },
        //   endDate: { $gte: event.startDate, $lte: event.endDate }
        // }
        startDate : {$lte : Date.now()}, endDate : {$gte : Date.now()}
      // ]
    });
    // const dbResponse = await controller.storage.collection.find({startDate : {$lte : Date.now()}, endDate : {$gte : Date.now()}});
    
    return y;
  },

}

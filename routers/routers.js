const Event = require("../models/event-model");
const User = require("../models/user-model")
const db = require("../config/db");

module.exports = {
  // Slack
  add_date: async message => {
    console.log("<----------MESSAGE-------->\n", message);
    console.log("<----Date NOW---->\n", Date.now());
    event = new Event();

    (event.slackID = message.userID),
      (event.startDate = message.start_date),
      (event.endDate = message.end_date),
      (event.message = "message.text");

    // let conflicts = await searchConflict(event);
    // if (conflicts.length === 0) {
    //   return await event.save();
    // } else {
    //   conflicts.push(event);
    //   conflicts.push("conflict");

    //   return conflicts;
    // }

    console.log("<-----EVENT------>", event);
    const dbResponse = await event.save();
    return dbResponse;
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
  },

  deleteVacation: async id => {
    const count = await Event.deleteOne({ _id: `${id}` });
    return count.n;
  },
  // Auth
  addUser: async profile => {

    if(!profile.sub) {
      return
    }
    
    // Get the id needed to authenticate user
    let split = profile.sub.split('|')[1]
    
    console.log(split)
    let user = new User({
      username: profile.nickname,
      first_name: profile.given_name,
      last_name: profile.family_name,
      email: profile.email,
      picture: profile.picture, 
    })

    console.log(user)

    const userAdd = await user.save()
    // return new_user
    return userAdd
  }
};

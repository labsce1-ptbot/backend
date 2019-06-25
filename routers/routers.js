const Event = require("../models/event-model");
const User = require("../models/user-model");
const db = require("../config/db");

module.exports = {
  // Slack
  add_date: async message => {
    console.log("<----------MESSAGE-------->\n", message);
    console.log("<----Date NOW---->\n", Date.now());

    const date_string = `${message.start_date}T12:59`;

    event = new Event();
    (event.slackID = message.userID),
      (event.startDate = date_string),
      (event.endDate = message.end_date),
      (event.message = "message.txt");

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
    console.log("<-----db------>", dbResponse);

    // const add_event_to_User = await User.updateOne(
    //   {
    //     email: message.email
    //   },
    //   { $push: { event: dbResponse._id } }
    // );

    console.log("<-----x------>", add_event_to_User);
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
    let foundUser = await User.find({ email: profile.email }, function(
      err,
      docs
    ) {
      console.log("error: ", err);
    });
    console.log(
      "<-=-=-=-= foundUser before if statement =-=-=-=-=->\n",
      foundUser
    );
    if (foundUser.length > 0) {
      console.log("<-=-=-=-=- foundUser =-=-=-=->\n", foundUser);
      return foundUser;
    }

    let newUser = new User({
      username: profile.nickname,
      first_name: profile.given_name,
      last_name: profile.family_name,
      email: profile.email,
      picture: profile.picture
    });

    console.log("<---=-=-=-=- NEWUSER =-=-=--->\n", newUser);

    let userAdd = await newUser.save();
    console.log("<-=-=-== userADD =-=-=-=-=->\n", userAdd);
    // return new_user
    return userAdd;
  },

  save_vacation: async message => {}
};

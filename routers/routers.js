const Event = require("../models/event-model");
const User = require("../models/user-model");
const Slack = require("../models/slack-model");
const db = require("../config/db");
const Messages = require("../models/messages-model");
const moment = require("moment");
const request = require("request");
require("dotenv").config();
const google = require("./googleCal-routes");

module.exports = {
  // Slack
  add_date: async message => {
    console.log("<----------MESSAGE-------->\n", message.userID);
    // console.log(
    //   "<----Date NOW---->\n",
    //   moment.tz(message.start_date, "America/New_York").format()
    // );
    let date_string;
    if (message.start_date.slice(-1) === "Z") {
      date_string = message.start_date;
    } else {
      date_string = `${message.start_date}T03:01:00.000Z`;
    }
    event = new Event();
    (event.slackID = message.userID),
      (event.teamID = message.teamID),
      (event.startDate = date_string),
      (event.endDate = message.end_date),
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

    if (message.msg) {
      messages = new Messages();
      (messages.recipient = message.msg_for),
        (messages.custom_message = message.msg);
      const save_messages = await messages.save();

      const add_event_ref = await Event.updateOne(
        { _id: dbResponse._id },
        { $push: { message: save_messages._id } }
      );
    }

    //adds the event id to ref on user table
    // const eventID_to_User = await User.updateOne(
    //   {
    //     email: "message.email"
    //   },
    //   { $push: { event: dbResponse._id } }
    // );

    return dbResponse;
  },

  get_date: async () => {
    console.log("<---- GET Date NOW---->\n");
    const y = await Event.find({
      startDate: { $lte: Date.now() },
      endDate: { $gte: Date.now() }
    }).populate({ path: "message" });

    console.log("=====y=====>\n", y);
    return y;
  },

  // searchConflict: async event => {
  //   const conflict_array = await Event.find({
  //     slackID: event.slackID,
  //     $or: [
  //       {
  //         startDate: { $gte: event.startDate, $lte: event.endDate },
  //         endDate: { $gte: event.startDate, $lte: event.endDate }
  //       }
  //     ]
  //   });

  //   console.log("=======conflict_array=========", conflict_array);
  //   return conflict_array;
  // },

  showAll: async message => {
    console.log(message.user);
    const all_msgs = await Event.find({
      slackID: message.user
    });
    console.log(all_msgs);
    return all_msgs;
  },

  //deletes a vacation
  deleteVacation: async id => {
    const event = await Event.find({ _id: `${id}` });
    const count = await Event.deleteOne({ _id: `${id}` });

    //deletes the ref in users
    // const remove_ref = await User.updateOne(
    //   { email: "message.email" },
    //   { $pull: { event: id } }
    // );

    if (event[0].message.length > 0) {
      const x = await Messages.deleteOne({ _id: event[0].message[0] });
    }

    return count.n;
  },

  // Auth
  findUser: async profile => {
    let foundUser = await User.find({ email: profile.email });
    console.log("--------FindUser--------\n", foundUser);
    if (foundUser.length > 0) {
      return foundUser;
    } else {
      return "User doesn't exist";
    }
  },
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
      picture: profile.picture,
      google_access_token: null,
      google_refresh_token: null
    });

    console.log("<---=-=-=-=- NEWUSER =-=-=--->\n", newUser);

    let userAdd = await newUser.save();
    console.log("<-=-=-== userADD =-=-=-=-=->\n", userAdd);
    // return new_user
    return userAdd;
  },

  testSlackAddUser: async profile => {
    const { user, team, displayName } = profile;
    let existingUser = await User.find({ email: user.email });
    let slackUser = await Slack.find({
      slackId: user.id,
      team_id: team.id
    });

    //if user exists return user
    if (existingUser.length > 0) {
      return existingUser;
    }
    //create a new slack user
    let newSlackUser = new Slack({
      slackId: user.id,
      team_id: team.id,
      validated: true
    });

    //save to slack collection
    let savedSlack;
    if (slackUser.length === 0) {
      savedSlack = await newSlackUser.save();
    }

    //create new user
    let newUser = new User({
      username: displayName,
      first_name: user.name,
      last_name: user.name,
      email: user.email,
      picture: user.image_72,
      google_access_token: null,
      google_refresh_token: null,
      slack: [savedSlack._id]
    });

    //save user to db
    let savedUser = await newUser.save();

    return savedUser;
  },

  save_vacation: async message => {},

  //runs every Sunday to clear out expired vacations
  clean_old_vacations: async () => {
    const old_events = await Event.find({ endDate: { $lt: Date.now() } });

    old_events_ids = [];
    old_messages_ids = [];

    if (old_events.length !== 0) {
      old_events.forEach(id => {
        old_events_ids.push(id._id);
        if (id.message.length > 0) {
          old_messages_ids.push(id.message[0]);
        }
      });

      await Event.deleteMany({ _id: { $in: old_events_ids } });
      await Messages.deleteMany({ _id: { $in: old_messages_ids } });
    }
  },

  // User slack info added to Slack document
  slackInfo: async data => {
    const userInfo = new Slack({
      slackId: data.user.id,
      team_id: data.team.id,
      validated: true
    });

    const foundInfo = await Slack.find({ team_id: data.team.id });

    // Checking if Slackinfo exists in database
    if (foundInfo.length > 0) {
      console.log("|---Slack Info Exists---|", foundInfo);
      return foundInfo;
    }

    console.log("|---Slackinfo created for database---|", userInfo);
    let slackAdd = await userInfo.save();

    const slack_to_User = await User.updateOne(
      { email: data.user.email },
      { $push: { slack: slackAdd._id } }
    );

    //adds the event id to ref on user table
    // const eventID_to_User = await User.updateOne(
    //   {
    //     email: "message.email"
    //   },
    //   { $push: { event: dbResponse._id } }
    // );

    console.log("|---Slackinfo saved---|\n", slack_to_User);
    return slackAdd;
  },
  // Find user and then add google access token
  addToken: async (id, token, refresh) => {
    const findUser = await User.findOne({ _id: id });
    console.log("|---User found before update for token---|\n", findUser);

    await findUser.updateOne({
      google_access_token: token,
      google_refresh_token: refresh
    });
    await findUser.save();
  }

  // refreshAccessToken: async (event, user) => {
  //   let url = `https://www.googleapis.com/oauth2/v4/token?refresh_token=${
  //     user.google_refresh_token
  //   }&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${
  //     process.env.GOOGLE_CLIENT_SECRET
  //   }&grant_type=refresh_token`;
  //   await request.post(url, async (err, httpResponse, body) => {
  //     let data = JSON.parse(body);

  //     const userToken = await User.updateOne(
  //       { _id: user._id },
  //       { google_access_token: data.access_token }
  //     );

  //     if (userToken.n === 1) {
  //       google.add_to_google(event);
  //     }
  //   });
  // }
};

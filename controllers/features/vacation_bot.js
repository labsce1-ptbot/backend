/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var cache = require("../../models/cache");
let db = require("../../routers/routers");
let moment = require("moment");
let block_helper = require("../../routers/interactive_blocks");

module.exports = function(controller) {
  // Temporarily holding user's input for start/end date
  var newDate = {};

  controller.hears("here", async (bot, message) => {
    console.log("====here====", message);
    await bot.replyPrivate(message, `I see you <@${message.user}>`);
  });

  // Response to (any) block actions (in this case) after calling slash commands
  controller.on("block_actions", async (bot, message) => {
    console.log("<-- MESSAGE -->\n", message);
    console.log("<-- newDate -->\n", newDate);
    const {
      block_id,
      selected_date,
      action_id,
      value
    } = message.incoming_message.channelData.actions[0];

    // Saving start_date to newDate
    if (action_id === "start_date") {
      if (newDate[block_id]) {
        newDate[`${block_id}`].start_date = selected_date;
      } else {
        newDate[`${block_id}`] = {
          userID: message.incoming_message.from.id,
          start_date: selected_date,
          end_date: ""
        };
      }
    }

    // Saving end_date to newDate
    if (action_id === "end_date") {
      if (newDate[block_id]) {
        newDate[`${block_id}`].end_date = selected_date;
      } else {
        newDate[`${block_id}`] = {
          userID: message.incoming_message.from.id,
          start_date: "",
          end_date: selected_date
        };
      }
    }
    // Submit button, it will also check if start or end date value is empty before sending.
    if (value === "Submit") {
      if (
        newDate[block_id].start_date === "" ||
        newDate[block_id].end_date === ""
      ) {
        await bot.replyPrivate(message, "Please select a start and end date");
      } else if (newDate[block_id].start_date > newDate[block_id].end_date) {
        const date_error_msg = `:warning: Your vacation ends before it begins\n (start: ${moment(
          newDate[block_id].start_date
        ).format("MMMM DD, YYYY")}, end: ${moment(
          newDate[block_id].end_date
        ).format("MMMM DD, YYYY")})\nPlease try again. :warning:`;

        await bot.replyPrivate(message, {
          blocks: block_helper.schedule_vacay(date_error_msg)
        });
      } else {
        const dbResponse = await db.add_date(
          newDate[message.actions[0].block_id]
        );

        if ((dbResponse.slackID = message.user)) {
          await bot.replyPrivate(message, "vacation time scheduled!");
          delete newDate[message.actions[0].block_id];
          console.log(newDate[message.actions[0].block_id]);
        } else {
          await bot.replyPrivate(message, "Vacation denied!");
        }
      }
    }

    // Temporarily solution to immediately pull data and save to cache.js
    if (message.incoming_message.channelData.actions[0].value === "finding") {
      const find = await db.get_date();
      console.log(find);
      find.forEach(obj => {
        cache[obj.slackID] = {
          start_date: obj.startDate,
          end_date: obj.endDate,
          message: obj.message
        };
      });
      console.log("<----What's in cache?!?------>\n", cache);
      // await bot.replyPublic(message, `${cache}`);
    }
  });

  //Slash command to start vacation bot
  controller.on("slash_command", async (bot, message) => {
    if (message.text === "plain") {
      await bot.reply(message, "This is a plain reply");
    } else if (message.text === "public") {
      await bot.replyPublic(message, "This is a public reply");
    } else if (message.text === "private") {
      await bot.replyPrivate(message, "This is a private reply");
    }

    // Display a button so you can load cache.js with users on vacation for that day, i.e. "/command testing"
    if (message.text === "testing") {
      await bot.replyPrivate(message, {
        blocks: [
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "finding",
                  emoji: true
                },
                value: "finding"
              }
            ]
          }
        ]
      });
    }

    if (message.text === "schedule") {
      const new_message = `Hey <@${
        message.user
      }>, let's get you set with the vacation date!\n\n\n\n\n\n\n*Please select the start and end date of your vacation time.*\n`;
      await bot.replyPrivate(message, {
        blocks: block_helper.schedule_vacay(new_message)
      });
      console.log(message);
    }

    // set http status
    // bot.httpBody({text:'You can send an immediate response using bot.httpBody()'});
  });

  // Provide response if someone mention a user that is on vacation.
  controller.on("message", async (bot, message) => {
    console.log("<-=-=-=-=-=-=MESSSAAAGE=-=-=-=-=-=-=->\n", message);
    const userRegex = /(U|W)(.){8}/.exec(`${message.text}`);

    if (userRegex !== null && cache[`${userRegex[0]}`] !== undefined) {
      if (message.channel_type === "group") {
        await bot.startPrivateConversation(message.user);
        await bot.say(
          ` <@${userRegex[0]}> is currently on vacation from <!date^` +
            moment(cache[`${userRegex[0]}`].start_date).unix() +
            `^{date_long}|Posted 2014-02-18 PST> until <!date^` +
            moment(cache[`${userRegex[0]}`].end_date).unix() +
            `^{date_long}|Posted 2014-02-18 PST>`
        );
      } else {
        await bot.replyInThread(
          message,
          ` <@${userRegex[0]}> is currently on vacation from <!date^` +
            moment(cache[`${userRegex[0]}`].start_date).unix() +
            `^{date_long}|Posted 2014-02-18 PST> until <!date^` +
            moment(cache[`${userRegex[0]}`].end_date).unix() +
            `^{date_long}|Posted 2014-02-18 PST>`
        );
      }
    }
  });

  // Deleting vacation from /slash all
  controller.on("block_actions", async (bot, message) => {
    if (
      message.actions[0].text != undefined &&
      message.actions[0].text.text === "Delete"
    ) {
      const dbResponse = await db.deleteVacation(message.actions[0].value);

      if (dbResponse > 0) {
        return await bot.replyPrivate(message, "Booo, Vacation deleted");
      } else {
        await bot.replyPrivate(
          message,
          "Hmmm, it seems your vacation was not delete. Are you sure you don't want the time off? If so try again"
        );
      }
    }
  });

  // Slash command to list all vacation time of user
  controller.on("slash_command", async (bot, message) => {
    if (message.text === "all") {
      const allMsgs = await db.showAll(message);
      if (allMsgs.length > 0) {
        let displayMsgs = allMsgs.map(dbRespond => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${moment(dbRespond.startDate).format(
              "MMMM DD, YYYY"
            )}* - *${moment(dbRespond.endDate).format(
              "MMMM DD, YYYY"
            )}*\nDelete this vacation?`
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Delete"
            },
            value: `${dbRespond._id}`,
            action_id: "button"
          }
        }));

        await bot.replyPrivate(message, { blocks: displayMsgs });
      } else {
        await bot.replyPrivate(
          message,
          "You don't have any vacations scheduled."
        );
      }
    }
  });
};

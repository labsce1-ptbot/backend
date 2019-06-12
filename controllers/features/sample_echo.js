/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// let mongoDB = require("../../config/db");
let add_date = require("../../routers/routers");
let moment = require("moment");

module.exports = function(controller) {
  controller.hears("sample", "message", async (bot, message) => {
    await bot.reply(message, "I heard a sample message.");
  });

  // const user = {
  //   "<@UK7L9AYFR>": true
  // };
  // const users = "<@UK7L9AYFR>";

  //Hard coded, but doesn't work as well
  // controller.hears(`${user}`, 'message,direct_message', async(bot, message) => {
  //     console.log(message)
  //     await bot.reply(message, `${user} is on vacation`);
  // });

  //Listen for users and make comparison on user object
  // controller.on("message", async (bot, message) => {
  //   const compare = message.incoming_message.channelData.text;
  //   if (user[compare]) {
  //     await bot.replyInThread(
  //       message,
  //       `Hey <@${message.incoming_message.channelData.user}>, ${
  //         message.incoming_message.channelData.text
  //       } is currently on Vacation`
  //     );
  //   }
  // });

  // Sample_echo
  // controller.on('message', async(bot, message) => {
  //     await bot.reply(message, `Echo: ${ message.text }`);
  // });

  controller.hears("yes", "message", async (bot, message) => {
    const dbResponse = await add_date(message);
    console.log("--------dbres-------", dbResponse);
    if (dbResponse[dbResponse.length - 1] === "conflict") {
      dbResponse.pop();
      let conflicts = dbResponse.map(dbRespond => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${dbRespond.startDate} - ${
            dbRespond.endDate
          }\nThese vacations are in conflict with each other`
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Choose"
          },
          value: dbRespond._id
        }
      }));

      await bot.reply(message, {
        blocks: conflicts
      });
    } else {
      await bot.reply(message, "vacation time scheduled!");
    }
  });

  controller.on("block_actions", async (bot, message) => {
    console.log("=======message========", message);
  });
};

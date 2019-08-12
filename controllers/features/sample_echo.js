/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// let mongoDB = require("../../config/db");
let db = require("../../routers/routers");
let moment = require("moment");

module.exports = function(controller) {
  // controller.hears("sample", "message", async (bot, message) => {
  //   await bot.reply(message, "I heard a sample message.");
  // });
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
  // controller.hears("yes", "message", async (bot, message) => {
  //   const dbResponse = await add_date(message);
  //   console.log("--------dbres-------", dbResponse);
  //   if (dbResponse[dbResponse.length - 1] === "conflict") {
  //     dbResponse.pop();
  //     let conflicts = dbResponse.map(dbRespond => ({
  //       response_type: "ephemeral",
  //       type: "section",
  //       text: {
  //         type: "mrkdwn",
  //         text: `${dbRespond.startDate} - ${
  //           dbRespond.endDate
  //         }\nThese vacations are in conflict with each other`
  //       },
  //       accessory: {
  //         type: "button",
  //         text: {
  //           type: "plain_text",
  //           emoji: true,
  //           text: "Choose"
  //         },
  //         value: dbRespond._id
  //       }
  //     }));
  //     await bot.reply(message, {
  //       blocks: conflicts
  //     });
  //   } else {
  //     await bot.reply(message, "vacation time scheduled!");
  //   }
  // });
  // controller.on("block_actions", async (bot, message) => {
  //   console.log(
  //     "=============adafa==============",
  //     message.actions[0].text.text
  //   );
  //   if (message.actions[0].text.text === "Delete") {
  //     const dbResponse = await db.deleteVacation(message.actions[0].value);
  //     if (dbResponse > 0) {
  //       return await bot.replyPrivate(message, "Booo, Vacation deleted");
  //     } else {
  //       await bot.replyPrivate(
  //         message,
  //         "Hmmm, it seems your vacation was not delete. Are you sure you don't want to go? If so try again"
  //       );
  //     }
  //   }
  // });
  // controller.on("slash_command", async (bot, message) => {
  //   if (message.text === "all") {
  //     const allMsgs = await db.showAll(message);
  //     if (allMsgs.length > 0) {
  //       let displayMsgs = allMsgs.map(dbRespond => ({
  // type: "section",
  // text: {
  //   type: "mrkdwn",
  //   text: `*${moment(dbRespond.startDate).format(
  //     "MMMM DD, YYYY"
  //   )}* - *${moment(dbRespond.endDate).format(
  //     "MMMM DD, YYYY"
  //   )}*\nTo remove this vacation please select delete from the dropdown.`
  // },
  // accessory: {
  //   type: "static_select",
  //   placeholder: {
  //     type: "plain_text",
  //     emoji: true,
  //     text: "Manage"
  //   },
  //   options: [
  //     {
  //       text: {
  //         type: "plain_text",
  //         emoji: true,
  //         text: "Edit it"
  //       },
  //       value: `edit ${dbRespond._id}`
  //     },
  //     {
  //       text: {
  //         type: "plain_text",
  //         emoji: true,
  //         text: "Delete"
  //       },
  //       value: `${dbRespond._id}`
  //     }
  //   ]
  // }
  //         type: "section",
  //         text: {
  //           type: "mrkdwn",
  //           text: `*${moment(dbRespond.startDate).format(
  //             "MMMM DD, YYYY"
  //           )}* - *${moment(dbRespond.endDate).format(
  //             "MMMM DD, YYYY"
  //           )}*\nDelete this vacation?`
  //         },
  //         accessory: {
  //           type: "button",
  //           text: {
  //             type: "plain_text",
  //             text: "Delete"
  //           },
  //           value: `${dbRespond._id}`,
  //           action_id: "button"
  //         }
  //       }));
  //       await bot.replyPrivate(message, { blocks: displayMsgs });
  //     } else {
  //       await bot.replyPrivate(
  //         message,
  //         "You don't have any vacations scheduled."
  //       );
  //     }
  //   }
  // });
  // controller.on("slash_command", async (bot, message) => {
  //   if (message.text === "all") {
  //     const allMsgs = await db.showAll(message);
  //     if (allMsgs.length > 0) {
  //       let displayMsgs = allMsgs.map(dbRespond => ({
  //         type: "section",
  //         text: {
  //           type: "mrkdwn",
  //           text: `*${moment(dbRespond.startDate).format(
  //             "MMMM DD, YYYY"
  //           )}* - *${moment(dbRespond.endDate).format(
  //             "MMMM DD, YYYY"
  //           )}*\nDelete this vacation?`
  //         },
  //         accessory: {
  //           type: "button",
  //           text: {
  //             type: "plain_text",
  //             text: "Delete"
  //           },
  //           value: `${dbRespond._id}`,
  //           action_id: "button"
  //         }
  //       }));
  //       await bot.replyPrivate(message, { blocks: displayMsgs });
  //     } else {
  //       await bot.replyPrivate(
  //         message,
  //         "You don't have any vacations scheduled."
  //       );
  //     }
  //   }
  // });
  // controller.on("block_actions", async (bot, message) => {
  //   if (message.actions[0].text.text === "Delete") {
  //     const dbResponse = await db.deleteVacation(message.actions[0].value);
  //     if (dbResponse > 0) {
  //       return await bot.replyPrivate(message, "Booo, Vacation deleted");
  //     } else {
  //       await bot.replyPrivate(
  //         message,
  //         "Hmmm, it seems your vacation was not delete. Are you sure you don't want the time off? If so try again"
  //       );
  //     }
  //   }
  // });
  // controller.on("message", async (bot, message) => {
  //   // console.log("<-=-=-=-=-=-=MESSSAAAGE=-=-=-=-=-=-=->\n", message);
  //   const userRegex = /(U|W)(.){8}/.exec(`${message.text}`);
  //   if (userRegex !== null && cache[`${userRegex[0]}`] !== undefined) {
  //     await bot.replyInThread(
  //       message,
  //       `Hey <@${message.user}>, <@${
  //         userRegex[0]
  //       }> is currently on vacation from <!date^${moment(
  //         cache[`${userRegex[0]}`].start_date
  //       ).unix()}^{date_long}|Posted 2014-02-18 PST> until <!date^${moment(
  //         cache[`${userRegex[0]}`].end_date
  //       ).unix()}^{date_long}|Posted 2014-02-18 PST>`
  //     );
  //   }
  // });
  // controller.on("slash_command", async (bot, message) => {
  //   if (message.text === "plain") {
  //     await bot.reply(message, "This is a plain reply");
  //   } else if (message.text === "public") {
  //     await bot.replyPublic(message, "This is a public reply");
  //   } else if (message.text === "private") {
  //     await bot.replyPrivate(message, "This is a private reply");
  //   }
  //   if (message.text === "testing") {
  //     await bot.replyPrivate(message, {
  //       blocks: [
  //         {
  //           type: "actions",
  //           elements: [
  //             {
  //               type: "button",
  //               text: {
  //                 type: "plain_text",
  //                 text: "finding",
  //                 emoji: true
  //               },
  //               value: "finding"
  //             }
  //           ]
  //         }
  //       ]
  //     });
  //   }
  // });
};

// await bot.reply(message, {
//   blocks: conflicts
// });

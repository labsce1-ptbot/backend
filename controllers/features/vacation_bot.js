/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var cache = require('../../models/cache');
let db = require("../../routers/routers");

module.exports = function(controller) {

    // Temporarily holding user's input for start/end date
    var newDate = {

    };

    controller.hears('here', async(bot, message) => {
        await bot.replyPrivate(message, `I see you <@${message.user}>`)
    });

    // Response to (any) block actions (in this case) after calling slash commands
    controller.on('block_actions', async (bot, message) => {
        console.log("<-- MESSAGE -->\n", message);

        // Saving start_date to newDate
        if (message.incoming_message.channelData.actions[0].action_id === 'start_date') {
            if (newDate[message.incoming_message.channelData.actions[0].block_id]) {
                newDate[`${message.incoming_message.channelData.actions[0].block_id}`].start_date = message.incoming_message.channelData.actions[0].selected_date;
            } 
            else {
                newDate[`${message.incoming_message.channelData.actions[0].block_id}`] = {
                    "userID" : message.incoming_message.from.id,
                    "start_date" : message.incoming_message.channelData.actions[0].selected_date,
                    "end_date" : "",
                }
            }
        }

        // Saving end_date to newDate
        if (message.incoming_message.channelData.actions[0].action_id === 'end_date') {
            if (newDate[message.incoming_message.channelData.actions[0].block_id]) {
                newDate[`${message.incoming_message.channelData.actions[0].block_id}`].end_date = message.incoming_message.channelData.actions[0].selected_date;
            } 
            else {
                 newDate[`${message.incoming_message.channelData.actions[0].block_id}`] = {
                    "userID" : message.incoming_message.from.id,
                    "start_date" : "",
                    "end_date" : message.incoming_message.channelData.actions[0].selected_date,
                }

            }
        }
        // Submit button, it will also check if start or end date value is empty before sending.
        if (message.incoming_message.channelData.actions[0].value === 'Submit') {
            if (newDate[message.incoming_message.channelData.actions[0].block_id].start_date === '' || newDate[message.incoming_message.channelData.actions[0].block_id].end_date === '') {
                await bot.replyPrivate(message, "Please select a start and end date");
            }
            else {
                const dbResponse = await db.add_date(newDate[message.actions[0].block_id]);

                if (dbResponse.slackID = message.user) {
                    await bot.replyPrivate(message, "vacation time scheduled!");
                    delete newDate[message.actions[0].block_id];
                    console.log(newDate[message.actions[0].block_id]);
                } else {
                    await bot.replyPrivate(message, "Vacation denied!");
                }
            }
        }

        if (message.incoming_message.channelData.actions[0].value === 'finding') {
            const find = await db.get_date();
            console.log(find);

            }
        
    
    })

    //Slash command to start vacation bot
    controller.on('slash_command', async(bot, message) => {
        if (message.text === 'plain') {
            await bot.reply(message, 'This is a plain reply');
        } else if (message.text === 'public') {
            await bot.replyPublic(message, 'This is a public reply');
        } else if (message.text === 'private') {
            await bot.replyPrivate(message, 'This is a private reply');
        }

        if (message.text === "testing") {
            await bot.replyPrivate(message, {
                blocks: [
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "finding",
                                    "emoji": true
                                },
                                "value": "finding"
                            }
                        ]
                    }
                ]
            })
        }


        if (message.text === 'schedule') {
            await bot.replyPrivate(message, {
                blocks:[
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Please select the start and end date of your vacation time."
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "datepicker",
                                "action_id" : "start_date",
                                // "initial_date": "2109-06-07",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select start date",
                                    "emoji": true
                                }
                            },
                            {
                                "type": "datepicker",
                                "action_id" : "end_date",
                                // "initial_date": "2019-06-07",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select end date",
                                    "emoji": true
                                }
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Submit",
                                    "emoji": true
                                },
                                "style": "primary",
                                "value": "Submit"
                            }
                            
                        ]
                    }
                ]
            })
            console.log(message);
        }

        // set http status
        // bot.httpBody({text:'You can send an immediate response using bot.httpBody()'});

    })

    controller.on('message', async (bot, message) => {
        const compare = message.incoming_message.channelData.text.slice(2, -1)
        // const compare = message.incoming_message.channelData.text;
        // /(U|W)(.){8}/   regex for user name
        // console.log(message);
        // await console.log("---------=============COMPARE========--------------\n", cache[compare].vacation);
        // if (user[][vacation] === null) {
        //     user[message.incoming_message.channelData.user] = message.incoming_message.channelData.user;
        //     user[message.incoming_message.channelData.user][vacation] = false;
        // } else if (user[compare].vacation) {
        //     await bot.replyInThread(message, `Hey <@${message.incoming_message.channelData.user}>, ${message.incoming_message.channelData.text} is currently on Vacation`)
        // }
        // if(cache.compare.vacation) {
            // await bot.replyInThread(message, `Hey <@${message.incoming_message.channelData.user}>, ${message.incoming_message.channelData.text} is currently on Vacation`)
        // }
    })



}
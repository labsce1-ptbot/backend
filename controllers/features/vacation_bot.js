/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = function(controller) {

    // var cache = {
        // 'UK7L9AYFR' : {
            // "vacation" : true,
        // }
    // }

    // var cache = {
    //     'UK7L9AYFR' : true
    // }
    var cache = {

    }

    var newDate = {

    }

    controller.hears('here', async(bot, message) => {
        await bot.replyPrivate(message, `I see you <${message.user}>`)
    })

    // Response to (any) block actions (in this case) after calling slash commands
    controller.on('block_actions', async (bot, message) => {
        // console.log("<-- BOT / Request -->\n", bot);
        console.log("<-- MESSAGE -->\n", message);
        // console.log("length of actions", message.incoming_message.channelData.actions[0].selected_date)
        // console.log("<----====== For each action ========------->\n", message.incoming_message.channelData.actions.map(f => { console.log(f)}));
        // await bot.replyEphemeral(message,
            // `<@${ message.user}> has selected ${ message.actions.selected_date }`)
        
        console.log("<========== checking on user ===========>\n", message.user);
        console.log("<-----=-=-=-=-=- checking on user object =-=-=-=-=------->\n", cache);
        // console.log("--------------------------blop ------------\n", message.incoming_message.channelData.actions[0]);
        const users = message.incoming_message.from.id;
        const test = JSON.stringify(message.incoming_message.from.id);
        // console.log("---------=-=-=-=-=-= blahblahblah===============\n", users);
        console.log("channel data user----------:\n", message.incoming_message.from.id);
        
        if (message.incoming_message.channelData.actions[0].action_id === 'start-date') {
            if (message.incoming_message.from.id === cache[`${message.incoming_message.from.id}`]) {
            // if (message.incoming_message.from.id === cache.users)
                // cache[`${message.incoming_message.from.id}`].vacation = false;
                // cache.users.start_date = message.incoming_message.channelData.actions[0].selected_date;
                newUser.start_date = message.incoming_message.channelData.actions[0].selected_date;
                console.log("<=========IF=======>\n", newUser);
                // console.log(cache[`${message.user}`].vacation);
                console.log(cache.users.start_date);
            } 
            else {
                cache[`${message.incoming_message.from.id}`] = {
                    "start_date" : message.incoming_message.channelData.actions[0].selected_date,
                    "end_date" : "",
                    "message" : "",
                    // "vacation" : false
                }
                // cache.users = message.incoming_message.from.id;
                // cache.users.vacation = false;
                // cache.users.start_date = message.incoming_message.channelData.actions[0].selected_date;
                console.log("<=====ELSE=====>\n", cache);
                // console.log(cache.users.vacation);
                // console.log(cache.users.start_date);
            }
        }
        await bot.replyEphemeral(message, `FIRED OFFFFFFF:  ${message.incoming_message.channelData.actions[0].selected_date}`)
    
        console.log("-=-=-=-=-=-=- checking on user object after: =-=-=-=-=-=-\n", cache);

    })

    controller.on('datepicker', async (bot, message) => {
        await bot.replyEphemeral(message, "Testing");
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
                                "action_id" : "start-date",
                                // "initial_date": "2109-06-07",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select start date",
                                    "emoji": true
                                }
                            },
                            {
                                "type": "datepicker",
                                "action_id" : "end-date",
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
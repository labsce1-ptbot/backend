/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require('botbuilder-adapter-slack');

module.exports = function(controller) {

    controller.ready(async () => {
        if (process.env.MYTEAM) {
            let bot = await controller.spawn(process.env.MYTEAM);
            await bot.startConversationInChannel(process.env.MYCHAN,process.env.MYUSER);
            bot.say('I AM AWOKEN.');
        }
    });

    controller.on('direct_message', async(bot, message) => {
        await bot.reply(message,'I heard a private message');
    });

    controller.hears('dm me', 'message', async(bot, message) => {
        await bot.startPrivateConversation(message.user);
        await bot.say(`Let's talk in private.`);
    });

    controller.on('direct_mention', async(bot, message) => {
        await bot.reply(message, `I heard a direct mention that said "${ message.text }"`);
    });

    controller.on('mention', async(bot, message) => {
        await bot.reply(message, `You mentioned me when you said "${ message.text }"`);
    });

    controller.hears('ephemeral', 'message,direct_message', async(bot, message) => {
        await bot.replyEphemeral(message,'This is an ephemeral reply sent using bot.replyEphemeral()!');
    });

    controller.hears('threaded', 'message,direct_message', async(bot, message) => {
        await bot.replyInThread(message,'This is a reply in a thread!');

        await bot.startConversationInThread(message.channel, message.user, message.incoming_message.channelData.ts);
        await bot.say('And this should also be in that thread!');
    });


    controller.hears('blocks', 'message', async(bot, message) => {

        await bot.reply(message,{
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
                        "alt_text": "alt text for image"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
                        "alt_text": "alt text for image"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
                        "alt_text": "alt text for image"
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Farmhouse",
                                "emoji": true
                            },
                            "value": "Farmhouse"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Kin Khao",
                                "emoji": true
                            },
                            "value": "Kin Khao"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Ler Ros",
                                "emoji": true
                            },
                            "value": "Ler Ros"
                        }
                    ]
                }
            ]
        });

    });

    // controller.on('block_actions', async (bot, message) => {
    //     await bot.reply(message, `Sounds like your choice is ${ message.incoming_message.channelData.actions[0].value }`)
    // });

    //Testing block actions
    controller.on('block_actions', async (bot, message) => {
        console.log("<-- BOT / Request -->\n", bot);
        console.log("<-- MESSAGE -->\n", message);
        console.log("length of actions", message.incoming_message.channelData.actions[0].selected_date)
        console.log("<----====== For each action ========------->\n", message.incoming_message.channelData.actions.forEach(f => { console.log(f)}));
        await bot.replyEphemeral(message, `<@${ message.incoming_message.from.id}> has selected ${ message.incoming_message.channelData.actions[0].value }`)
    })

    // controller.on('block_actions', async (bot, message) => {
    //     if 
    // })

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
                                // "initial_date": "2109-06-07",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select start date",
                                    "emoji": true
                                }
                            },
                            {
                                "type": "datepicker",
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

    });

    controller.on('interactive_message', async (bot, message) => {

        console.log('INTERACTIVE MESSAGE', message);

        switch(message.actions[0].name) {
            case 'replace':
                await bot.replyInteractive(message,'[ A previous message was successfully replaced with this less exciting one. ]');
                break;
            case 'dialog':
                await bot.replyWithDialog(message, new SlackDialog('this is a dialog', '123', 'Submit', [
                    {
                        type: 'text',
                        label: 'Field 1',
                        name: 'field1',
                    },
                    {
                        type: 'text',
                        label: 'Field 2',
                        name: 'field2',
                    }
                ]).notifyOnCancel(true).state('foo').asObject());
                break;
            default:
                await bot.reply(message, 'Got a button click!');
        }
    });


    controller.on('dialog_submission', async (bot, message) => {
        await bot.reply(message, 'Got a dialog submission');

        // Return an error to Slack
        bot.dialogError([
            {
                "name": "field1",
                "error": "there was an error in field1"
            }
        ])
    });

    controller.on('dialog_cancellation', async (bot, message) => {
        await bot.reply(message, 'Got a dialog cancellation');
    });

}
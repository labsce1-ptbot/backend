/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function(controller) {

    controller.hears('sample','message', async(bot, message) => {
        await bot.reply(message, 'I heard a sample message.');
    });

    // const user = { id: 'UK7L9AYFR' };
    // const user = { id: 'UJUDJ1VH8' };
    // const user = 'taile602';
    const user = {
        '<@UK7L9AYFR>' : true,
    }
    const users = "<@UK7L9AYFR>"

    // controller.hears(`${user}`, 'message,direct_message', async(bot, message) => {
    //     console.log(message)
    //     await bot.reply(message, `${user} is on vacation`);
    // });

    controller.on('message', async (bot, message) => {
        const compare = message.incoming_message.channelData.text
        if (user[compare]) {
            await bot.reply(message, `Hey <@${message.incoming_message.channelData.user}>, ${message.incoming_message.channelData.text} is currently on Vacation`)
        }
        // console.log(message)
        // await bot.reply(message, `${message.text}`);
    })

    // controller.on('message', async(bot, message) => {
    //     await bot.reply(message, `Echo: ${ message.text }`);
    // });

}
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bal",
    description: "Look at your balance",

    run: (_client, message, _args, _guildInfo, userInfo) => {
        message.reply(
            { embeds: [
                new MessageEmbed()
                    .setTitle(`${message.author.tag}'s Balance`)
                    .addFields(
                        { name:`Wallet:`, value:`${userInfo.economy.wallet}$`}, 
                        { name:`Bank:`, value:`${userInfo.economy.bank}$` }
                    )
                ]
            }
        )
    }
}
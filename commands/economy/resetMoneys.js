const { MessageEmbed } = require("discord.js");
const userList = require("../../schemas/user");

module.exports = {
    name: "reset-money",
    description: "Clear your profile",
    aliases: ["cls"],

    run(_client, message, _args, _guildData, userData) {
        message.reply("Do you really want to reset your profile?");
        const collector = message.channel.createMessageCollector({ filter: msg => msg.author.id === message.author.id, time: 30000 });

        collector.on("collect", async msg => {
            switch (msg.content.toLowerCase()) {
                case "yes":
                case "ok":
                    userData.economy.wallet = 0;
                    userData.economy.bank = 0;
                    userList.findByIdAndUpdate(userData._id, { economy: userData.economy }, (err, data) => { });
                    message.followUp("Congratulations! Your profile was cleared!");
                    collector.stop('success');
                    break;
                case "no":
                    message.followUp("Canceled");
                    collector.stop('success');
                    break;
            }

            collector.stop('success');
        });

        collector.on("end", (_ignore, error) => {
            if (error && error !== 'success') {
                return message.followUp({ embeds: [new MessageEmbed().setTitle("Timed Out").setColor("RED")] });
            }
            collector.stop("success");
        });
    }
}
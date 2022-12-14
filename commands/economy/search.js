const { Random } = require("sussyutilbyraphaelbader");
const { MessageEmbed } = require("discord.js");
const users = require("../../schemas/user");

module.exports = {
    name: "search",
    description: "Search in a few places for money.",
    cooldown: 60,

    run:(_client, message, _args, _guildData, userData) => {
        const places = [ "bank", "river", "pocket" ];
        message.reply("Please tell me where you want to search.\n" + places.map(e => "`" + e + "`").join(", "));
        const collector = message.channel.createMessageCollector({filter:msg => msg.author.id === message.author.id, time: 30000 });

        collector.on("collect", async msg => {
            if(places.includes(msg.content)) {
                const amount = Random.randomInt(900, 1600);
                const current = userData.economy;
                current.wallet += amount;
                users.findByIdAndUpdate(userData._id, { economy: current }, (err, data) => { });
                message.followUp(`You found ${amount}$ in the ${msg.content}.`);
            }
        });

        collector.on("end", async (_ignore, error) => {
            if(error && error !== 'success') {
                return message.followUp({ embeds: [ new MessageEmbed().setTitle("Timed Out").setColor("RED") ] });
            }   
            collector.stop("success");
        });
    }
}
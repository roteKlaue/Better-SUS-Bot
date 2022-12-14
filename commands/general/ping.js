const { MessageEmbed } = require("discord.js");

const after = (client, message, msg, start) => {
    const EndDate = Date.now();
    const embed = new MessageEmbed()
        .setColor("DARK_RED")
        .setTitle("Pong!")
        .addFields({ name: "Message Latency", value: `${Math.floor(EndDate - start)}ms` },
            { name: "API Latency", value: `${Math.round(client.ws.ping)}ms` })
        .setTimestamp(new Date);

    message.followUp({ embeds: [embed] });
}

module.exports = {
    name: "ping",
    description: "Pings the bot and displays the latency of the bot and the latency of the api.",

    run: async (client, message) => {
        const sendObj = { embeds: [new MessageEmbed().setColor("#fff").setDescription("Please Wait...")] };
        const StartDate = Date.now();
        message.reply(sendObj).then(msg => after(client, message, msg, StartDate));
    }
}
module.exports = {
    name: "nowplaying",
    description: "Shows the current song",
    aliases: ["current"],

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const queue = client.player.getQueue(message.guild.id)

        if (!queue) 
            return message.channel.send("There is no queue");

        if (!queue.current) 
            return message.channel.send("Currently not playing anything");

        message.channel.send(`Now Playing: **${current.title}**\n`);
    }
}
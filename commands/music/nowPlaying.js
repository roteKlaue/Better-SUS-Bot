module.exports = {
    name: "nowplaying",
    description: "Shows the current song",
    aliases: ["current"],

    run: async (client, message) => {
        const queue = client.player.getQueue(message.guild.id)

        if (!queue) 
            return message.reply("There is no queue");

        if (!queue.current) 
            return message.reply("Currently not playing anything");

        message.reply(`Now Playing: **${current.title}**\n`);
    }
}
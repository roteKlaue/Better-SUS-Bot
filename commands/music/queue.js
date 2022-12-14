module.exports = {
    name: "queue",
    description: "Shows the song queue",

    run: async (client, message) => {
        const playerInfo = client.player.getQueue(message.guild.id);

        if (!playerInfo) 
            return message.reply("There are no songs in the queue");

        message.reply(`Current: **${playerInfo.current.title}**\n` + playerInfo.queue.join((e,i) => `${i + 1}. **${e.title}**\n`));
    }
}
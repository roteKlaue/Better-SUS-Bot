module.exports = {
    name: "queue",
    description: "Shows the song queue",

    run: async (client, message, args, a, b, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const playerInfo = client.player.getQueue(message.guild.id);

        if (!playerInfo) 
            return message.channel.send("There are no songs in the queue");

        message.channel.send(`Current: **${playerInfo.current.title}**\n` + playerInfo.queue.join((e,i) => `${i + 1}. **${e.title}**\n`));
    }
}
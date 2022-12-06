const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "displays information mentions user/author",

    run(client, message, args, a, b, slash) {
        if(slash) message.reply("ok");
        const user = message.mentions.users.first() || message.author;

        message.channel.send({ embeds: [ new MessageEmbed()
            .setTitle("**Userinfo**")
            .setColor("RANDOM")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Username", value: user.username, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Discriminator", value: user.discriminator, inline: true },
                { name: "Bot", value: `${user.bot? "bot": "user"}`, inline: true },
                { name: "Verified", value: user.verified? "Yes" : "No", inline: true },
                { name: "Created", value: user.createdAt.toDateString(), inline: true },
                { name: "Joined", value: new Date(message.guild.members.cache.get(user.id).joinedTimestamp).toDateString(), inline: true },
            )
            .setTimestamp(new Date())
            .setFooter(client.config.embedFooter(client))
        ]});
    }
}
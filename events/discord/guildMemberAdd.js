const guilds = require("../../schemas/guild");
const replaceUser = require("../../functions/replaceUser.js");

module.exports = async (client, member) => {
    const guild = await guilds.findOne({ guildId: member.guild.id });
    if (!guild?.channels?.welcome) return;
    const channel = client.channels.cache.get(guild.channels.welcome);
    channel.send(replaceUser(client.config.welcomeMessages[Math.floor(Math.random() * client.config.welcomeMessages.length)], member));
}
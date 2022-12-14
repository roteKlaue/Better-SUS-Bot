const guilds = require("../../schemas/guild");
const replaceUser = require("../../functions/replaceUser.js");

module.exports = async (client, member) => {
	const guild = await guilds.findOne({ guildId: member.guild.id });
    if(!guild?.channels?.goodbye) return;
	const channel = client.channels.cache.get(guild?.channels?.goodbye);
	if(!channel) return;
	channel.send(replaceUser(client.config.goodbyeMessages[Math.floor(Math.random() * client.config.goodbyeMessages.length)], member));
}
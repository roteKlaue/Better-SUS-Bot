const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");
const { Collection } = require("discord.js");

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	interaction.channel = client.channels.cache.get(interaction.channelId);
	interaction.author = interaction.user;
	let guildData = await guildModel.findOne({ guildId: interaction.guild.id });
	if (!guildData) {
		addGuildDocument(interaction.guild);
		guildData = await guildModel.findOne({ guildId: interaction.guild.id });
	}

	let userData = await userModel.findOne({ userid: interaction.user.id });
	if(!userData) {
		addUserDocument(interaction.user);
		userData = await userModel.findOne({ userId: interaction.user.id });
	}
	if (!cmd) return;
	
	if(!client.cooldowns.has(cmd.name)) {
        client.cooldowns.set(cmd.name, new Collection());
    }

	if(cmd.cooldown) {
        const current = Date.now();
        const time_stamps = client.cooldowns.get(cmd.name);
        const cooldownTime = (cmd.cooldown) * 1000;
    
        if(time_stamps.has(interaction.author.id)) {
            const expiration_time = time_stamps.get(interaction.author.id) + cooldownTime;
            if(current < expiration_time) {
                const time_left = (expiration_time - current) / 1000;
                return interaction.reply(`Please wait ${time_left.toFixed(1)} more seconds before using this command.`);
            }
        }

		time_stamps.set(interaction.author.id, current);
        setTimeout(() => time_stamps.delete(interaction.author.id), cooldownTime);
    }

	cmd.run(client, interaction, interaction.options._hoistedOptions.map(e => e.value), guildData, userData, true);
}
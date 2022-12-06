const addGuildDocument = require("../../functions/addGuildDocument");
const addUserDocument = require("../../functions/addUserDocument");
const guildModel = require("../../schemas/guild");
const userModel = require("../../schemas/user");

module.exports = async (client, message) => {
    if (message.author.bot) return;                                                 // Ignore bots
    let guildData = await guildModel.findOne({ guildId: message.guild.id });
    if (!guildData) {
        addGuildDocument(message.guild);
        guildData = await guildModel.findOne({ guildId: message.guild.id });
    }

    let userData = await userModel.findOne({ userid: message.author.id });
	if(!userData) {
		addUserDocument(message.author);
		userData = await userModel.findOne({ userId: message.author.id });
	}

    const counter = require("../../functions/counter.js");
    if (counter(message, guildData)) return;                                        // Check if the message is in the counter channel, if so, run the counter function

    const isBotChannel = require("../../functions/checkChannelID.js");
    if (!isBotChannel(message, guildData)) return;                                  // Ignore messages not in allowed channels

    const prefix = client.config.prefix;                                            // Get the prefix from the .env file

    if (!message.content.startsWith(prefix)) return;                                // Ignore messages that don't start with the prefix

    const args = message.content.slice(prefix.length).trim().split(/ +/g);          // Get the arguments
    const command = args.shift().toLowerCase();                                     // Get the cmd name
    const cmd = client.commands.get(command) ||                                     // Get the cmd from the commands collection
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    if (!cmd) return;

    if (cmd.permissions?.length && !message.member.permissions.has(cmd.permissions)) {
        return message.channel.send("You don't the required permissions to use this command.");
    }

    cmd.run(client, message, args, guildData, userData);
}

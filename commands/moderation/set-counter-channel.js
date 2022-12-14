const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const guilds = require("../../schemas/guild");

module.exports = {
    name: "set-counter-channel",
    description: "Sets the counter channel",
    aliases: ["scc"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set as counter channel.",
            required: true
        }
    ],

    default_member_permissions: ManageChannel,
    permissions: [ ManageChannels ],

    run: async (_client, message, args) => {
        if(!args[0]) return message.reply("Please mention the channel you want to set as counter channel.");
        const channel = getChannelFromMention(message.guild, args[0]);
        if (!channel) return message.reply("Please specify the counter channel.");
        const current = guildInfo.channels;
        current.counter = channel.id;

        guilds.findByIdAndUpdate(guildInfo._id, { channels: current }, (err, data) => { });
        message.reply(`Set counter channel to ${channel.toString()}`);
    }
}
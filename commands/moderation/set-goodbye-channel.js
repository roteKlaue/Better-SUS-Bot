const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");
const guilds = require("../../schemas/guild");

module.exports = {
    name: "set-goodbye-channel",
    description: "Sets the goodbye channel",
    aliases: ["sgc"],

    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set as goodbye channel.",
            required: true
        }
    ],

    default_member_permissions: ManageChannel,
    permissions: [ ManageChannels ],

    run: async (client, message, args, guildInfo, a, slash) => {
        if(!args[0]) return message.reply("Please mention the channel you want to set as goodbye channel.");
        const channel = getChannelFromMention(message.guild, args[0]);
        if (!channel) return message.reply("Please specify the welcome channel.");
        const current = guildInfo.channels;
        current.goodbye = channel.id;

        guilds.findByIdAndUpdate(guildInfo._id, { channels: current }, (err, data) => { });
        message.reply(`Set goodbye channel to ${channel.toString()}`);
    }
}
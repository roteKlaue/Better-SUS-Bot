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

    run: async (client, message, args, guildInfo, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const channel = getChannelFromMention(message.guild, args[0]);
        if (!channel) return message.channel.send("Please specify the counter channel.");
        const current = guildInfo.channels;
        current.counter = channel.id;

        guilds.findByIdAndUpdate(guildInfo._id, { channels: current }, (err, data) => { });
        message.channel.send(`Set counter channel to ${channel.toString()}`);
    }
}
const { IsSomething } = require("sussyutilbyraphaelbader");
const { ManageChannels } = require("../../enums/permissionBitField");
const { ManageChannels: ManageChannel } = require("../../enums/permissionStrings");
const getChannelFromMention = require("../../functions/getChannelFromMention");

module.exports = {
    name: "slowmode",
    description: "Sets the slowmode of the current channel",

    option: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set the slowmode of",
            required: true
        },
        {
            name: "timeout",
            type: "NUMBER",
            description: "The timeout you want in seconds",
            required: false
        }
    ],

    default_member_permissions: ManageChannel,
    permissions: [ ManageChannels ],

    run(client, message, args, a, slash) {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            message.delete();
        }

        if(!args[0]) return message.channel.send("Please mention the channel you want to lockdown.");
        const channel = getChannelFromMention(message.guild, args[0]);
        if (!channel) return message.channel.send("Please specify the channel you want to set the slowmode of.");

        if (!args[1]) {
            channel.setRateLimitPerUser(0);
            return message.channel.send(`The slowmode of ${channel.toString()} was removed.`);
        }

        if (!IsSomething.isNumber(args[1] + "")) return message.channel.send("Please enter a number for the slowmode.");
        channel.setRateLimitPerUser(+args[1]);
        message.channel.send(`The slowmode of ${channel.toString()} was set to ${args[1]}seconds.`);
    }
}
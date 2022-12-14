const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    name: "remove-nickname",
    aliases: ["remove-nick", "reset-nick", "reset-nickname", "un-nick", "un-nickname", "unnick", "unnickname"],
    description: "Removes a user\"s nickname",

    options: [
        {
            name: "user",
            type: "USER",
            description: "User you want to change the nickname of",
            required: true,
        }
    ],

    default_member_permissions: mngNick,
    permissions: [ ManageNicknames ],

    async run(_client, message, args) {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.reply("You did not mention a user for me to change their nickname!");
        if (!mentionedMember) return message.reply("Please mention a user for me to change their nickname \`$nickname @user nickname\`");
        if (!mentionedMember.nickname) return message.reply("Mentioned user does not have a nickname.");

        try {
            await mentionedMember.setNickname(null);
            message.reply(`Removed nickname of ${mentionedMember.toString()}.`);
        } catch (err) {
            message.reply(`I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username} username.`);
        }
    }
}
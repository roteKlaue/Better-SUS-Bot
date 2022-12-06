const { ManageNicknames } = require("../../enums/permissionBitField");
const { ManageNicknames: mngNick } = require("../../enums/permissionStrings");

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    description: "Nicks a user",

    options: [
        {
            name: "user",
            type: "USER",
            description: "user you want to change the nickname of",
            required: true,
        },
        {
            name: "nickname",
            type: "string",
            description: "nickname to change to",
            required: true,
        }
    ],

    permissions: [ ManageNicknames ],
    default_member_permissions: mngNick,

    async run(client, message, args, a, slash) {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const nickName = args.slice(1).join(" ");

        if (!args[0]) return message.channel.send("You did not mention a user for me to change their nickname!");
        if (!mentionedMember) return message.channel.send("Please mention a user for me to change their nickname \`$nickname @user nickname\`");
        if (!nickName) return message.channel.send("Please provide a nickname for me to change this users nickname");

        try {
            const username = mentionedMember.nickname || mentionedMember.user.username;
            await mentionedMember.setNickname(nickName);
            message.channel.send(`Set nickname of ${username} to ${nickName}.`);
        } catch (err) {
            message.channel.send(`I do not have the required permissions to to set ${mentionedMember.nickname || mentionedMember.user.username}"s username.`);
        }
    }
}
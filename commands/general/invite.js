const { CreateInstantInvite } = require("../../enums/permissionBitField");
const { CreateInstantInvite: createInv } = require("../../enums/permissionStrings");
module.exports = {
    name: "invite",
    description: "Sends the invite link of the server",

    default_member_permissions: createInv,
    permissions: [ CreateInstantInvite ],

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "Here you go: ", ephemeral: true });
        }
        message.channel.createInvite({ unique: true, temporary: false }).then(invite =>
            message.channel.send({ content: "https://discord.gg/" + invite.code }));
    }
}
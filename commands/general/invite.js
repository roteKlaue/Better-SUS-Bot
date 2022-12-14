const { CreateInstantInvite } = require("../../enums/permissionBitField");
const { CreateInstantInvite: createInv } = require("../../enums/permissionStrings");
module.exports = {
    name: "invite",
    description: "Sends the invite link of the server",

    default_member_permissions: createInv,
    permissions: [ CreateInstantInvite ],

    run: async (_client, message) => {
        message.channel.createInvite({ unique: true, temporary: false }).then(invite =>
            message.reply({ content: "https://discord.gg/" + invite.code }));
    }
}
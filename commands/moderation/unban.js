const { BanMembers } = require("../../enums/permissionBitField");
const { BanMembers: banMbs } = require("../../enums/permissionStrings");

module.exports = {
    name: "unban",
    description: "Unbans a user",

    options: [
        {
            name: "user",
            type: "USER",
            description: "User you want to unban",
            required: true,
        }
    ],

    default_member_permissions: banMbs,
    permissions: [ BanMembers ],

    run: async (_client, message, args) => {
        if (!args[0])
            return message.reply("Please provide the user u want to unban Unban!");

        const bans = await message.guild.bans.fetch();
        const member = bans.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bans.get(args[0]) || bans.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());

        if (!member)
            return message.reply("Please Give Valid Member ID Or Member Is Not Banned!");

        try {
            const reason = args.slice(1).join(" ");
            await message.guild.members.unban(member.user.id, reason);
            message.reply(`Unbanned <@!${args[0]}>. With reason: ${reason || "No Reason Provided!"}`);
        } catch (error) {
            message.reply("I can't unban that user. Error: " + error.message);
        }
    }
}
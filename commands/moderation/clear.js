const { ManageMessages } = require("../../enums/permissionBitField");
const { ManageMessages: manageMsgs } = require("../../enums/permissionStrings");

module.exports = {
    name: "clear",
    description: "Clears the last n messages",

    options: [
        {
            name: "query",
            type: "NUMBER",
            description: "amount of messages to clear",
            required: true
        }
    ],

    default_member_permissions: manageMsgs,

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        } else {
            if (!message.member.permissions.has(ManageMessages)) {
                return client.errorStrings.PERMISSION_ERROR;
            }
        }

        const amount = +args[0];

        if (isNaN(amount)) return "Please provide a number as the first argument.";

        if (amount <= 0) return "Number must be at least 1.";

        let deletedMessagesCount = slash ? 0 : -1;
        while (deletedMessagesCount < amount) {
            const deleteThisTime = Math.min(...[100, amount - deletedMessagesCount]);
            const deletedMessages = await message.channel.bulkDelete(deleteThisTime, true)
                .catch(err => message.channel.send("An error occurred."));
            if (!deletedMessages || deletedMessages.size === 0) break;
            deletedMessagesCount += deletedMessages.size;
        }

        if (deletedMessagesCount === 0) {
            message.channel.send("I can't delete messages which are older than two weeks.");
        }

        message.channel.send(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}

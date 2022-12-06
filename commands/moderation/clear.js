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
    permissions: [ ManageMessages ],

    run: async (client, message, args, a, slash) => {
        if (slash) {
            message.reply({ content: "ok", ephemeral: true });
        }

        let amount = +args[0];

        if (isNaN(amount)) return message.channel.send("Please provide a number as the first argument.");
        if (amount <= 0) return message.channel.send("Number must be at least 1.");

        let deletedMessagesCount = 0;
        while (0 != amount) {
            const deletedMessages = await message.channel.bulkDelete(amount > 100? 100:amount, true)
                .catch(err => message.channel.send("An error occurred."));
            if (!deletedMessages || deletedMessages.size === 0) break;
            amount -= deletedMessages.size;
            deletedMessagesCount += deletedMessages.size;
        }
        
        if (deletedMessagesCount === 0) 
            message.channel.send("I can't delete messages which are older than two weeks.");

        message.channel.send(`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}

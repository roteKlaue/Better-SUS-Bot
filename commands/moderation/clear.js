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

    run: async (_client, message, args) => {
        let amount = +args[0];

        if (isNaN(amount)) return message.reply("Please provide a number as the first argument.");
        if (amount <= 0) return message.reply("Number must be at least 1.");

        let deletedMessagesCount = 0;
        while (0 != amount) {
            const deletedMessages = await message.channel.bulkDelete(amount > 100? 100:amount, true)
                .catch(err => message.channel.send("An error occurred."));
            if (!deletedMessages || deletedMessages.size === 0) break;
            amount -= deletedMessages.size;
            deletedMessagesCount += deletedMessages.size;
        }
        
        if (deletedMessagesCount === 0) 
            return message.reply("I can't delete messages which are older than two weeks.");

        message.reply({ content:`Deleted ${deletedMessagesCount} messages from <#${message.channel.id}>`, ephemeral:true }).then(msg => {
            setTimeout(() => {try{msg.delete()} catch(e) {}}, 5000);
        });
    }
}

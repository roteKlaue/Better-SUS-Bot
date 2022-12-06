const { IsSomething } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "dep",
    description: "Deposit your wallet into your bank account",

    aliases:[ "deposit" ],

    run: async (client, message, args, guildInfo, userInfo, slash) => {
        if(slash) message.reply({ content: "ok", ephemeral: true });
        if(!args[0]) return message.channel.send("Please provide the amount you want to deposit.");

        const current = userInfo.economy;
        let moneys = current.wallet;

        if(args[0] === "max") {
            current.bank += current.wallet;
            current.wallet = 0;
        } else {
            if(!IsSomething.isNumber(args[0])) return message.channel.send("Please provide the amount you want to deposit as a number.");
            if(+args[0] > current.wallet) return message.channel.send("You do not have enough money to deposit " + args[0] + "$.");
            current.bank += +args[0];
            current.wallet -= +args[0];
            moneys = +args[0];            
        }

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });
        message.channel.send(`Deposited ${moneys}$`);
    }
}
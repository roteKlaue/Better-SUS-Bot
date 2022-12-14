const { IsSomething } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "dep",
    description: "Deposit your wallet into your bank account",

    aliases:[ "deposit" ],

    run: async (_client, message, args, _guildInfo, userInfo) => {
        if(!args[0]) return message.reply("Please provide the amount you want to deposit.");

        const current = userInfo.economy;
        let moneys = current.wallet;

        if(args[0] === "max") {
            current.bank += current.wallet;
            current.wallet = 0;
        } else {
            if(!IsSomething.isNumber(args[0])) return message.reply("Please provide the amount you want to deposit as a number.");
            if(+args[0] > current.wallet) return message.reply("You do not have enough money to deposit " + args[0] + "$.");
            current.bank += +args[0];
            current.wallet -= +args[0];
            moneys = +args[0];            
        }

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });
        message.reply(`Deposited ${moneys}$`);
    }
}
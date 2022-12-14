const { IsSomething } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "withdraw",
    description: "withdraw money from the bank",

    run: async (_client, message, args, _guildInfo, userInfo) => {
        if(!args[0]) return message.reply("Please provide the amount you want to deposit.");

        const current = userInfo.economy;
        let moneys = current.bank;

        if(args[0] === "max") {
            current.wallet += current.bank;
            current.bank = 0;
        } else {
            if(!IsSomething.isNumber(args[0])) return message.reply("Please provide the amount you want to withdraw as a number.");
            if(+args[0] > current.bank) return message.reply("You do not have enough money to withdraw " + args[0] + "$.");
            current.bank -= +args[0];
            current.wallet += +args[0];
            moneys = +args[0];
        }

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });
        message.reply(`Withdrawed ${moneys}$`);
    }
}
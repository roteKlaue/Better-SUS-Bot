const { IsSomething } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "coinflip",
    description: "flip a coin",

    options: [
        {
            name: "side",
            description: "the side to flip",
            type: "STRING",
            required: true
        },
        {
            name: "amount",
            description: "the amount of money you want to bet",
            type: "NUMBER",
            required: false
        }
    ],

    run(client, message, args, _guildInfo, userInfo) {
        if(args[0] !== "head" && args[0] !== "tail") return message.reply(`Please provide head or tail and the amount you want to bet \`${client.config.prefix}coinflip [head|tail] {amount}\``);
        const res = Math.random() > 0.5? "head": "tail";
        
        if(!args[1] || +args[1] <= 0) {
            return message.reply(`The coin landed on ${res}. You ${res === args[0]? "won": "lost"}.`);
        }

        if(!IsSomething.isNumber(args[1])) return message.reply("Please provide a number as the second argument.");
        if(+args[1] > userInfo.economy.wallet) return message.reply("You don't have enough money in your wallet.");

        const current = userInfo.economy;

        if(args[0] === res) {
            current.wallet += +args[1] * .5;
            users.findByIdAndUpdate(userInfo._id, { economy: current }, (_err, _data) => { });
            return message.reply(`The coin landed on ${res}. You won ${+args[1] * .5}$.`);
        }

        current.wallet -= +args[1];
        users.findByIdAndUpdate(userInfo._id, { economy: current }, (_err, _data) => { });
        message.reply(`The coin landed on ${res}. You lost ${args[1]}$.`);
    }
}
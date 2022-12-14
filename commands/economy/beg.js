const { Random } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "beg",
    description: "Beg for money",
    cooldown: 30,

    run: (_client, message, _args, _guildInfo, userInfo) => {
        const amount = Random.randomInt(200, 600);
        const current = userInfo.economy;
        current.wallet += amount;

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });

        const messages = [ "A kind stranger gave you **{amount}$**.", "Here you go leave me alone. Drops **{amount}$**." ];
        message.reply(messages[Math.floor(Math.random() * messages.length)].replace("{amount}", amount));
    }
}
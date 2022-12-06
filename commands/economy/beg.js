const { Random } = require("sussyutilbyraphaelbader");
const users = require("../../schemas/user");

module.exports = {
    name: "beg",
    description: "Beg for money",
    cooldown: 30,

    run: (client, message, args, guildInfo, userInfo, slash) => {
        if (slash) {
            message.reply({ content: "Here you go: ", ephemeral: true });
        }
        const amount = Random.randomInt(200, 600);
        const current = userInfo.economy;
        current.wallet += amount;

        users.findByIdAndUpdate(userInfo._id, { economy: current }, (err, data) => { });

        const messages = [ "A kind stranger gave you **{amount}$**.", "Here you go leave me alone. Drops **{amount}$**." ];
        message.channel.send(messages[Math.floor(Math.random() * messages.length)].replace("{amount}", amount));
    }
}
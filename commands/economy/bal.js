module.exports = {
    name: "bal",
    description: "Look at your balance",

    run: (client, message, args, guildInfo, userInfo, slash) => {
        if (slash) {
            message.reply({ content: "Here you go: ", ephemeral: true });
        }
        
        message.channel.send(`Wallet: ${userInfo.economy.wallet}\nBank: ${userInfo.economy.bank}`)
    }
}
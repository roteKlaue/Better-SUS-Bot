module.exports = {
    name: "work",
    description: "Work for money",


    run:(client, message, args, guildInfo, userInfo, slash) => {
        if(slash) message.reply("ok");
        
    }
}
module.exports = {
    name: "invitebot",
    description: "Sends the invite link of the bot",

    run: async (client, message) => {
        message.reply({ content: "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot%20applications.commands" });
    }
}
module.exports = {
    name: "resume",
    aliases: ["unpause"],
    description: "Resumes playing",

    run(client, message, args, a, b, slash) {
        if (slash) message.reply("ok");
        client.player.resume(message);
    }
}
module.exports = {
    name: "resume",
    aliases: ["unpause"],
    description: "Resumes playing",

    run(client, message) {
        client.player.resume(message);
    }
}
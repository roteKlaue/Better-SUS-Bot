module.exports = {
    name: "loop",
    description: "Loops the current queue.",
    aliases: ["repeat"],

    run(client, message) {
        client.player.toggleLoop(message);
    },
};
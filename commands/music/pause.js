module.exports = {
    name: "pause",
    aliases: [],
    description: "Pauses the current song",

    run(client, message) {
        client.player.pause(message);
    }
}
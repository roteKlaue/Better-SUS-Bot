module.exports = {
    name: "clear-queue",
    description: "Clears the song queue.",

    run(client, message) {
        client.player.clearQueue(message);
    }
}
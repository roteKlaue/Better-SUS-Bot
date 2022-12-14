module.exports = {
    name: "stop",
    description: "Stops the music and clears the queue",
    aliases: ["disconnect", "leave"],

    run: async (client, message) => {
        client.player.stop(message);
    }
}
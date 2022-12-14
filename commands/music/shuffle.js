module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: ["mix"],

    run: async (client, message) => {
        client.player.shuffle(message);
    }
}
module.exports = {
    name: "troll",
    aliases: ["t"],
    category: "Music",
    description: "A wild troll appeared.",

    run(client, message) {
        client.player.troll(message);
    },
};
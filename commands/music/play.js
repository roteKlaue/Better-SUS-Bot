module.exports = {
    name: "play",
    description: "Adds a song to the queue",

    options: [
        {
            name: "query",
            type: "STRING",
            description: "Link/Name of track to play",
            required: true
        }
    ],

    async run(client, message, args) {
        client.player.addTrack(message, args);
    }
}
module.exports = {
    name: "skip",
    description: "Skips current track",

    run: (client, message, args, a, b, slash) => {
        if (slash) {
            message.reply("ok");
        }
        client.player.skip(message);                                        // call the skip function from the player
    }
}
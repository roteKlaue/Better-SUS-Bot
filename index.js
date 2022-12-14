const { Client, Collection, Intents } = require("discord.js");
const { connect, connection, set } = require("mongoose");
const Player = require("./music/player");
const fs = require("fs");
require("dotenv").config();
// set('strictQuery', false);

/* Create a new client instance */
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

/* add important stuff to client */
client.player = new Player(client);
client.commands = new Collection();
client.config = require("./config");
client.connection = connection;
client.cooldowns = new Collection();

module.exports = client;

/* Loading all the commands. */
fs.readdirSync("./commands").forEach(dir => {
    if (!fs.lstatSync("./commands/" + dir).isDirectory()) return;
    fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
        const command = require(`./commands/${dir}/${file}`);
        if (!command.name?.length) return;
        command.category = dir;
        client.commands.set(command.name, command);
    })
});

const eventToClientMap = {
    discord: client,
    mongodb: connection,
};

/* Loading all the events. */
fs.readdirSync("./events").forEach((dir) => {
    if (!fs.lstatSync("./events/" + dir).isDirectory() || !eventToClientMap[dir]) return;
    fs.readdirSync(`./events/${dir}`).filter(e => e.endsWith(".js")).forEach(event => eventToClientMap[dir].on(event.split(".")[0], require(`./events/${dir}/${event}`).bind(null, client)));
});

/* Logging the bot in. */
client.login(process.env.TOKEN);
/* Connect to the mongodb database */
connect(process.env.MONGODB);
/* Starting the Webserver */
require("./www/index").startServer(client, process.env.PORT, () => console.log("Webserver started."));
const guildNumber = new Map();
const guildAttempts = new Map();

const guildNumberMap = (message) => {
    const guildId = message.guild.id;   
    const number = Math.floor(Math.random() * 20000) + 1;
    if (!guildNumber.get(guildId)) {
        guildNumber.set(guildId, number);
    }
}

const guildAttemptsMap = (message) => {
    const guildId = message.guild.id;
    if (!guildAttempts.get(guildId)) {
        guildAttempts.set(guildId, { attempts: 1 });
    } else {
        guildAttempts.get(guildId).attempts++;
    }
}


module.exports = {
    name: "guess",
    description: "Guess a number from 1 - 20000",

    run(client, message, args, guildData, userData, slash) {
        if(slash) {
            return message.send("ok");
        }

        guildNumberMap(message);
        guildAttemptsMap(message);

        const { member, channel, guild } = message;
        const number = guildNumber.get(guild.id);
        if(!args[0]) return channel.send("Please enter a number from 1 - 20000.");
        const guess = +args[0];

        if(isNaN(guess)) return channel.send("Please enter a number"); 

        if(guess === number) {
            const attempts = guildAttempts.get(guild.id);
            guildNumber.delete(guild.id);
            guildAttempts.delete(guild.id);
            return channel.send(`✅ Perfect, <@${member.id}> the number was ${number}, it only took you ${attempts.attempts} attempts!`);
        }

        channel.send(`${guess} Is too ${guess < number? "low":"high"}`);
    }
}
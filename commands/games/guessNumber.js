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

    run(_client, message, args) {
        guildNumberMap(message);
        guildAttemptsMap(message);

        const { member, guild } = message;
        const number = guildNumber.get(guild.id);
        if(!args[0]) return message.reply("Please enter a number from 1 - 20000.");
        const guess = +args[0];

        if(isNaN(guess)) return message.reply("Please enter a number"); 

        if(guess === number) {
            const attempts = guildAttempts.get(guild.id);
            guildNumber.delete(guild.id);
            guildAttempts.delete(guild.id);
            return message.reply(`✅ Perfect, <@${member.id}> the number was ${number}, it only took you ${attempts.attempts} attempts!`);
        }

        message.reply(`${guess} Is too ${guess < number? "low":"high"}`);
    }
}
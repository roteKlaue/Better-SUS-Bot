module.exports = (message, guildData) => {
    if (!guildData?.channels?.allowed) return true;
    if (Array.isArray(guildData.channels.allowed)) {
        if (!guildData.channels.allowed.length) return true;
        return guildData.channels.allowed.includes(message.channel.id);
    } else {
        return guildData.channels.allowed === message.channel.id;
    }
}
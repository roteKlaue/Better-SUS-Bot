const guildModel = require("../../schemas/guild");

module.exports = async (client, guild) => {
    guildModel.findOneAndDelete({ guildId: guild.id }, (err, data) => {});
}
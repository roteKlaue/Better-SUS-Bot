const { StringUtil } = require("sussyutilbyraphaelbader");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "help",
    description: "Displays all commands / more information about one command",
    aliases: ["h"],

    options: [
        {
            name: "query",
            description: "name of the command",
            type: "STRING",
            required: false,
        }
    ],

    run(client, message, args) {
        const commandName = args[0];
        const embed = new MessageEmbed()
            .setTimestamp(new Date())
            .setTitle("Help panel")
            .setFooter(client.config.embedFooter(client));

        if (!commandName || !commandName.length) {
            embed.setDescription(`To see more information type **${client.config.prefix}help {command name}**`)
                .addFields(...fs.readdirSync(`${__dirname}/../`).map((d) => ({
                    name: StringUtil.capitalize(d),
                    value: client.commands.filter(x => x.category == d).map((x) => "`" + x.name + "`").join(", ")
                })));
        } else {
            const cmd = client.commands.get(commandName) ||
                client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!cmd) {
                return message.reply(`No command found for: \`${commandName}\``);
            }

            // TODO: Add more information

            embed.addFields(
                {
                    name: "Name",
                    value: cmd.name,
                    inline: true
                },
                {
                    name: "Description",
                    value: cmd.description,
                    inline: true
                },
                {
                    name: "Category",
                    value: cmd.category,
                    inline: true
                },
                {
                    name: cmd.aliases?.length > 1 ? "Aliases" : "Alias",
                    value: cmd.aliases?.length > 0 ? cmd.aliases.join(", ") : "None",
                    inline: true
                },
                {
                    name: "Cooldown",
                    value: cmd.cooldown? `${cmd.cooldown}seconds`: "None",
                    inline: true
                }
            );
        }

        message.reply({ embeds: [embed] });
    }
}
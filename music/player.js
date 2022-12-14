const { createAudioPlayer, createAudioResource, joinVoiceChannel, entersState, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const { stream: AudioStream, video_basic_info, search, yt_validate } = require("play-dl");
const { ImprovedArray } = require("sussyutilbyraphaelbader");
const { MessageEmbed, Collection } = require("discord.js");

module.exports = class Player {
    #queue = new Collection();
    #client;

    constructor(client) {
        this.#client = client;

        this.#client.on("voiceStateUpdate", (oldState, newState) => {
            const queue = this.getQueue(newState.guild.id);

            if (!queue || !oldState.channelId) {
                return;
            }

            if (oldState.id !== this.#client.user.id) {
                if (this.#channelEmpty(oldState.channelId)) {
                    queue.current.channel.send("Leaving channel because it is empty.");
                    this.#destroyQueue(newState.guild.id);
                }
                return;
            }
            if (!newState.channelId) {
                queue.current.channel.send("I have been kicked from the channel.");
                this.#destroyQueue(newState.guild.id);
            }

            if (oldState.channelId !== newState.channelId) {
                queue.voiceChannel = newState.channelId;
            }
        });
    }

    #newQueue(guildId) {
        this.#queue.set(guildId, {
            connection: null,
            voiceChannel: null,
            player: null,
            current: null,
            loop: false,
            guildId: null,
            queue: new ImprovedArray()
        });
    }

    #destroyQueue(guildId) {
        const queue = this.#queue.get(guildId);
        if (!queue) return;
        queue.connection.destroy();
        this.#queue.delete(guildId);
    }

    async play(guildId, track) {
        const guildInfo = this.#queue.get(guildId);
        if (!guildInfo) return;
        guildInfo.current = track;

        const stream = await AudioStream(track.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        guildInfo.player.play(resource);
        track.channel.send(`Now playing **${track.title}**`);
    }

    async #createEmbed(info, type) {
        const embed = new MessageEmbed()
            .setURL(info.url)
            .setColor("DARK_AQUA")
            .setTimestamp(new Date())
            .setFooter(require("../config").embedFooter(this.#client));

        if (info.title) {
            embed.setTitle(`${type} track ${info.title}`);
        }

        if (info.thumbnails) {
            const thumbnail = info.thumbnails[info.thumbnails.length - 1];
            if (thumbnail) {
                embed.setImage(thumbnail.url);
            }
        }

        return embed;
    }

    async addTrack(message, args) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");

        const videoName = args.map(e => e.trim()).join(" ").trim();

        if (videoName === "") return message.reply("Please enter the link/name of the track");

        let url;
        if (videoName.startsWith("https") && yt_validate(videoName) === "video") {
            url = videoName;
        } else {
            const yt_infos = await search(args.join(" ").trim(), { limit: 10 });
            for(let i = 0; i < yt_infos.length; i++) {
                url = yt_infos[i].url;
                if(!this.#isAgeRestricted(url)) break;
            }
        }

        let info;
        try {
            info = (await video_basic_info(url)).video_details;
        } catch (err) {}
        
        if (!info) {
            return message.reply("Can't play tracks requiring age verification! Skipping...");
        }

        if (!this.#queue.has(message.guild.id)) {
            this.#newQueue(message.guild.id);
            const queue = this.#queue.get(message.guild.id);
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
            connection.subscribe(player);

            queue.connection = connection;
            queue.player = player;
            queue.voiceChannel = message.member.voice.channel.id;
            queue.guildId = message.guild.id;

            queue.connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    message.channel.send("There was an error connecting to the voice channel.");
                    this.#destroyQueue(queue.guildId);
                }
            });

            queue.player.on("error", (err) => {
                message.channel.send("An error occurred while playing the track.");
                this.#destroyQueue(message.guild.id);
            });

            queue.player.on(AudioPlayerStatus.Idle, () => {
                if (queue.loop) queue.queue.push(queue.current);
                const queueElement = queue.queue.shift();
                if (!queueElement) {
                    message.channel.send("Played all tracks leaving the channel.");
                    return this.#destroyQueue(message.guild.id);
                }
                this.play(message.guild.id, queueElement);
            });

            message.reply({ embeds: [await this.#createEmbed(info, "Playing")] });
            return this.play(message.guild.id, { url: url, channel: message.channel, title: info.title, duration: info.durationRaw });
        }

        const queue = this.#queue.get(message.guild.id);

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to add new tracks.");
        
        queue.queue.push({ url: url, channel: message.channel, title: info.title, duration: info.durationRaw });
        message.reply({ embeds: [await this.#createEmbed(info, "Added")] });
    }

    skip(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        const queueElement = queue.queue.shift();


        if (!queueElement && !queue.loop) {
            this.#destroyQueue(message.guild.id);
            return message.reply("Skipped last track. Leaving channel.");
        }

        this.play(message.guild.id, queueElement);

        message.reply("Skipped track.");
    }

    stop(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        message.reply("Leaving channel.");
        this.#destroyQueue(message.guild.id);
    }

    shuffle(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        queue.queue.shuffle();
        message.reply("Shuffled the Queue.");
    }

    getQueue(guildId) {
        return this.#queue.get(guildId);
    }

    getCurrent(guildId) {
        return this.#queue.get(guildId)?.current;
    }

    clearQueue(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        queue.queue.clear();
        message.reply("Cleared queue.");
    }

    #channelEmpty(channelId) {
        return this.#client.channels.cache.get(channelId).members.filter((member) => !member.user.bot).size === 0;
    }

    async troll(message) {
        try { await message.delete() } catch (e) {}
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return;
        message.reply({content:"trollolololo", ephemeral: true}).then(async e => {try{e.delete();}catch(e){}})
        queue.queue.clear();
        this.play(message.guild.id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", channel: message.channel, title: "Rick Astley - Never Gonna Give You Up (Official Music Video)", duration: "3:32" });
    }

    toggleLoop(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");
        
        queue.loop = !queue.loop;
        message.reply(`Looping is now ${queue.loop?"en":"dis"}abled`);
    }

    pause(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        if (queue.player.state.status == "playing") {
            queue.player.pause();
            return message.reply("The track has been paused");
        } 
        
        if (queue.player.state.status == "paused") {
            return message.reply("The track is already paused");
        }
    }

    resume(message) {
        if (!message.member.voice?.channel) return message.reply("Connect to a Voice Channel");
        const queue = this.#queue.get(message.guild.id);
        if (!queue) return message.reply("No queue for guild.");

        if (queue.voiceChannel !== message.member.voice.channel.id)
            return message.reply("You have to be in the same voice channel as the bot to stop the bot.");

        if (queue.player.state.status == "paused") {
            queue.player.unpause();
            return message.reply("The track has been resumed");
        } 
        
        if (queue.player.state.status == "playing") {
            return message.reply("The track is already playing");
        }
    }

    async #isAgeRestricted(url) {
        try {
            (await video_basic_info(url)).video_details;
        } catch (err) {
            return true;
        }
        return false;
    }
};
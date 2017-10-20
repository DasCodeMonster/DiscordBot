const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");

class Skip extends commando.Command {
    constructor(client) {
        super(client, {
            name: "skip",
            group: "music",
            memberName: "skip",
            description: "skip a song!",
            guildOnly: true
        });
        this.queue = [];
    }
    async run(message, args) {
        if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
            message.guild.voiceConnection.dispatcher.end("!skip");
        } else if (message.member.voiceChannel) {
            message.member.voiceChannel.join();
            if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 0){
                this.queue = await this.client.provider.get(message.guild, "queue");
                this.onEnd(message, "!skip");
            }
            else {
                console.log("queue is empty!");
            }
        }
        else {
            message.reply("I don't play any Songs at the moment!");
        }
    }
    async play(message) {
        if (this.queue.length > 0) {
            //var vid = this.queue.splice(0, 1)[0];
            var vid = this.queue[0];            
            this.client.provider.set(message.guild, "queue", this.queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                this.onEnd(message, reason);
            });
        }
    }
    async onEnd(message, reason) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 1) {
            var queue = await this.client.provider.get(message.guild, "queue");
            if (reason && reason !== "!skip") {
                if (await this.client.provider.get(message.guild, "song", false)) {

                } else {
                    var vidold = queue.splice(0, 1)[0];
                    if (await this.client.provider.get(message.guild, "list", false)){
                        queue.push(vidold);
                    }
                }
            }
            else {
                var vidold = queue.splice(0, 1)[0];
                if (await this.client.provider.get(message.guild, "list", false)){
                    queue.push(vidold);
                }              
            }
            var vid = queue[0];
            console.log(vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            this.client.provider.set(message.guild, "queue", queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                if (reason) console.log(reason);
                this.onEnd(message, reason);
            });
        }
        else {
            var empty = [];
            this.client.provider.set(message.guild, "queue", empty);
            console.log("queue is empty");
            return;
        }
    }
}
module.exports = Skip;
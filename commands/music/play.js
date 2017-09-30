const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});

class PlayCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            group: "music",
            memberName: "play",
            description: "let the bot play a youtubevideo.",
            details: "the bot needs to be in a voicechannel.",
            guildOnly: true,
            args: [{
                key: 'link',
                label: 'link',
                prompt: 'Which song would you like to play? You only need to give the link to the video.',
                type: 'string'
            }]
        })
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            if (message.guild.voiceConnection.speaking) {
                await this.validation(message, args);
            }
            else{
            await this.validation(message, args);
            }
        }
        else {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join();
                await this.validation(message, args);
            }
            else {
                message.reply("you need to join a voicechannel first");
            }
        }
    }
    async validation(message, args) {
        await ytdl.getInfo(args.link, async(err, info) => {
            if (err) {
                console.log(err);
                console.log("search for vids");
                await this.search(message, args);
            }
            else{
                this.play(message, info.video_id);
                //await this.addSingle(message, args, info);
            }
        });
    }
    async addSingle(message, args, info) {
        console.log(info.video_id);
        this.play(message, info.video_id);
    }
    async search(message, args) {
        var oneLiner = "you searched for: " +args.link+"\nResults:\n"+"```";
        var request = await youtubeV3.search.list({
            part: "snippet",
            type: "video",
            maxResults: 5,
            q: args.link,   
        }, (err, response) => {
            for (var i=0; i<5; i++) {
                console.log(response.items[i].snippet.title);
                console.log(i);
                oneLiner += (i+1+" "+response.items[i].snippet.title+"\n");
            }
            oneLiner += "```";              
            this.waitForMessage(message, args, oneLiner, response);
        });
    }
    async waitForMessage(message, args, oneLiner, response) {
        console.log(oneLiner);
        var commandmsg = await message.reply("type the number of the song to play:\n"+oneLiner+"Respond with ``cancel`` to cancel the command.\n"+
            "The command will automatically be cancelled in 30 seconds, unless you respond.");
        const responses = await message.channel.awaitMessages(msg2 => {
            if (msg2.author.id === message.author.id) {
                console.log(msg2.id);
                msg2.delete();
                return true;
            }}, {
            maxMatches: 1,
            time: 30000,
            errors: ["time"]
        });
        var value;
        if(responses && responses.size === 1) value = responses.first().content; else return null;
        if(value.toLowerCase() === 'cancel') {
            commandmsg.delete();
            return null;
        }
        message
        commandmsg.delete();
        console.log(value);
        console.log(response.items[value-1].id.videoId);
        await this.play(message, response.items[value-1].id.videoId);
    }
    async play(message, vidID) {
        console.log(vidID);
        this.client.provider.set(message.guild, "queue", this.queue);
        var stream = ytdl(vidID);
        var info = await ytdl.getInfo(vidID).catch(err => {
            console.log(err);
        });
        message.guild.voiceConnection.playStream(stream);
        if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
        else message.guild.voiceConnection.dispatcher.setVolume(0.3);
        message.channel.send("Now playing: "+info.title);
        message.guild.voiceConnection.dispatcher.on("end", reason => {
            this.onEnd(message);
        });
    }
    async onEnd(message) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            message.guild.voiceConnection.playStream(await ytdl(queue[0], {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            var info = await ytdl.getInfo(queue[0])
            message.channel.send("Now playing: "+info.title);
            queue.splice(0, 1);
            this.client.provider.set(message.guild, "queue", queue);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                if (reason) console.log(reason);
                this.onEnd(message);
            });
        }
        else {
            console.log("queue is empty");
            return;
        }
    }
}
module.exports = PlayCommand;   
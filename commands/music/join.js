const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");

class joinVoicechannelCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'music',
            memberName: 'join',
            description: 'Let the Bot join your Voicechannel.',
            guildOnly: true
        });
        this.queue = [];
    }

    async run(message, args) {
        console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join();
            console.log("Guild: "+message.guild.name+", joined voicechannel: "+message.member.voiceChannel.name);
            message.reply("ok i joined voicechannel: " + message.member.voiceChannel.name);
            if (this.client.provider.get(message.guild, "queue")){
                this.queue = await this.client.provider.get(message.guild, "queue");
                this.play(message);
            }
        }
        else {
            message.reply("you need to join a voicechannel first!");
        }
    }
    async play(message) {
        var vid = this.queue.splice(0, 1);
        this.client.provider.set(message.guild, "queue", this.queue);
        try {
            var stream = ytdl(vid[0][0]);
            var info = await ytdl.getInfo(vid[0][0]).catch(err => {
                console.log(err);
            });
        }
        catch (err) {
            console.log(err);
            this.play(message);
        }
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
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            await ytdl.getInfo(queue[0][0], async (err, info) => {
                if (err) {
                    console.log(err);
                    queue.splice(0, 1);
                    await this.client.provider.set(message.guild, "queue", queue);
                    this.onEnd(message);
                    return;
                }
                else {
                    var stream = await ytdl(queue[0][0], {filter: "audioonly"});
                    message.guild.voiceConnection.playStream(stream, {filter: "audioonly"});            
                    if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                    else message.guild.voiceConnection.dispatcher.setVolume(0.3);
                    message.channel.send("Now playing: "+info.title);
                    queue.splice(0, 1);
                    this.client.provider.set(message.guild, "queue", queue);
                    message.guild.voiceConnection.dispatcher.on("end", reason => {
                        if (reason) console.log(reason);
                        this.onEnd(message);
                    });
                }
            });
        }
        else {
            console.log("queue is empty");
            return;
        }
    }
}
module.exports = joinVoicechannelCommand;
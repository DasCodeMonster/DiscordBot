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
    }

    async run(message, args) {
        console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join();
            console.log("Guild: "+message.guild.name+", joined voicechannel: "+message.member.voiceChannel.name);
            message.reply("ok i joined voicechannel: " + message.member.voiceChannel.name);
            if (this.client.provider.get(message.guild, "queue")){
                console.log(this.client.provider.get(message.guild, "queue"));
                var stream = ytdl(await this.client.provider.get(message.guild, "queue")[0], {filter: "audioonly"});
                message.guild.voiceConnection.playStream(stream);
                if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                else message.guild.voiceConnection.dispatcher.setVolume(0.3);
                message.guild.voiceConnection.dispatcher.on("end", reason => {
                    onEnd(this.client, message);
                });
                var info = await ytdl.getInfo(this.client.provider.get(message.guild, "queue")[0]);
                message.reply("now playing: "+info.title); 
            }
        }
        else {
            message.reply("you need to join a voicechannel first!");
        }
        async function onEnd(client, message) {
            console.log("File ended");
            console.log(client.provider.get(message.guild, "queue"));
            console.log(client.provider.get(message.guild, "queue").length);
            if (client.provider.get(message.guild, "queue").length > 0) {
                var queue = await client.provider.get(message.guild, "queue");
                message.guild.voiceConnection.playStream(await ytdl(queue[0], {filter: "audioonly"}));
                if (client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(client.provider.get(message.guild, "volume"));
                else message.guild.voiceConnection.dispatcher.setVolume(0.3);
                console.log(message.guild.voiceConnection.dispatcher.volume);
                var info = await ytdl.getInfo(queue[0])
                message.channel.send("Now playing: "+info.title);
                var rest = queue.splice(0, 1);
                console.log("rest: "+rest);
                console.log(queue);
                client.provider.set(message.guild, "queue", queue);
                console.log(client.provider.get(message.guild, "queue"));                
                message.guild.voiceConnection.dispatcher.on("end", reason => {
                    onEnd(client, message);
                });
            }
            else {
                console.log("queue is empty");
                return;
            }
        }
    }
}
module.exports = joinVoicechannelCommand;
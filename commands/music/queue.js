const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");

class Queue extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            aliases: ["q"],
            group: "music",
            memberName: "queue",
            description: "This command shows you all the queued songs!",
            guildOnly: true
        });
        this.queue = [];
    }
    async run(message, args){
        //await this.client.provider.set(message.guild, "queue", this.queue);
        if (this.client.provider.get(message.guild, "queue")) this.queue = await this.client.provider.get(message.guild, "queue");
        if (this.queue.length === 0) {
            message.reply("The queue is empty!");
            return;
        }
        else {
            var messageBuilder = "";
            if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
                var time = message.guild.voiceConnection.dispatcher.time;
                var seconds = time/1000;
            }
            else var seconds = 0;
            if (this.queue.length === 1) {
                var element = this.queue[0];
                message.reply(`Now playing: ${element.title} from: ${element.author} | ${(seconds-(seconds%60))/60}:${Math.round(seconds%60)<10?"0"+Math.round(seconds%60):Math.round(seconds%60)}/${element.length}`);
                return;
            }
            await this.queue.some((element, index) => {
                if (index === 0) messageBuilder += `Now playing: ${element.title} from: ${element.author} | ${(seconds-(seconds%60))/60}:${Math.round(seconds%60)<10?"0"+Math.round(seconds%60):Math.round(seconds%60)}/${element.length}` + "```"
                else {
                    if (index === 49 || messageBuilder.length >= 1800) {
                        messageBuilder += `...and ${this.queue.length-index} more!`;
                        return true;
                    }
                    else {
                        messageBuilder += (index)+" Title: "+element.title + " | Channel: "+ element.author + "\n";
                        return false;
                    }
                }
            });
            messageBuilder += "```";
            message.reply(messageBuilder);
        }
    }
}
module.exports = Queue;
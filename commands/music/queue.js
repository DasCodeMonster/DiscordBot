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
        if (this.client.provider.get(message.guild, "queue")) this.queue = await this.client.provider.get(message.guild, "queue");
        if (this.queue.length == 0) {
            message.reply("The queue is empty!");
            return;
        }
        else {
            var messageBuilder = "```";
            await this.queue.some((element, index) => {
                if (index === 50) return true;
                else {
                    messageBuilder += element[1] + "\n";
                    return false;
                }
            });
            messageBuilder += "```";
            message.reply(messageBuilder);
        }
    }
}
module.exports = Queue;
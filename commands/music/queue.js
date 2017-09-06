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
    }
    async run(message, args){
        var queue = this.client.provider.get(message.guild, "queue");
        var messageBuilder = "";
        if (queue && queue != []){
            var i = 0;
            queue.forEach(async (songID) => {
                console.log(songID);
                messageBuilder += await ytdl.getInfo(songID).catch(err => {
                    console.log(err);
                }); + "\n";
                if (i == 50) return;
                i++;
            });
            message.reply(messageBuilder);
        }
        else{
            message.reply('you havent add any songs to the queue yet.\n Add songs to the queue with ``!qa <link>``');
        }
    }
}
module.exports = Queue;
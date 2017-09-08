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
        this.titles = [];
    }
    async run(message, args){
        /*var queue = this.client.provider.get(message.guild, "queue");
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
        }*/
        var queue = await this.client.provider.get(message.guild, "queue");
        console.log(queue);
        if (queue && queue.length > 0) {
            message.reply(queue);
            queue.forEach(song => {
               ytdl.getInfo(song, (err, info) => {
                   if (err) console.log(err);
                   else {
                       console.log(info.title);
                       this.titles.push(info.title);
                   }
                }); 
            });
        }
        var messageBuilder = "";
        this.titles.forEach(title => {
            messageBuilder += title +"\n";
        });
        console.log(messageBuilder);
        console.log(this.titles.length);
    }
}
module.exports = Queue;
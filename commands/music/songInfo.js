const commando = require("discord.js-commando");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});

class SongInfo extends commando.Command {
    constructor(client) {
        super(client, {
            name: "songinfo",
            aliases: ["si"],
            group: "music",
            memberName: "songinfo",
            description: "Gives detailed information about the current song or a song in queue.",
            guildOnly: true,
            args: [{
                key: "number",
                label: "songnumber",
                prompt: "",
                type: "integer",
                default: 0,
                infinite: false,
                min: 0
            }],
            argsPromptLimit: 0
        });
        this.queue = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 0) this.queue = await this.client.provider.get(message.guild, "queue");
        console.log(args.number);
        console.log(this.queue.length);
        console.log(args.number > this.queue.length-1);
        console.log(this.queue);
        if (args.number > this.queue.length-1) return;
        console.log(this.queue[0]);
        console.log(this.queue[args.number]);
        console.log(message.guild.member(this.queue[args.number].queuedBy).user.toString());
        youtubeV3.videos.list({
            part: "snippet, contentDetails",
            id: this.queue[args.number].ID
        }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log(data.items[0].snippet.thumbnails);
                if (data.items[0].snippet.thumbnails.maxres) var img = data.items[0].snippet.thumbnails.maxres;
                else if(data.items[0].snippet.thumbnails.high) var img = data.items[0].snippet.thumbnails.high;
                else if(data.items[0].snippet.thumbnails.standard) var img = data.items[0].snippet.thumbnails.standard;
                else var img = data.items[0].snippet.thumbnails.default;
                message.channel.send({embed: {
                    "author": {
                        "name": this.queue[args.number].title,
                        "url": `https://www.youtube.com/watch?v=${data.items[0].id}`
                    },
                    "color": 666,
                    "thumbnail": {
                        "url": img.url,
                        "width": img.width,
                        "height": img.height
                    },
                    "timestamp": new Date(),
                    "fields": [{
                        "name": "Channel",
                        "value": `[${data.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${data.items[0].snippet.channelId})`,
                        "inline": true
                    },  {
                        "name": "Length",
                        "value": this.queue[args.number].length,
                        "inline": true
                    }, {
                        "name": "Description",
                        "value": data.items[0].snippet.description.length > 1024 ? data.items[0].snippet.description.substring(0,1009) + "\n...<too long>" : data.items[0].snippet.description
                    }, {
                        "name": "Queued by",
                        "value": message.guild.member(this.queue[args.number].queuedBy).user.toString(),
                        "inline": true
                    }, {
                        "name": "Queued at",
                        "value": this.queue[args.number].queuedAt,
                        "inline": true
                    }, {
                        "name": "Thumbnail",
                        "value": img.url
                    }],
                    "image":{
                        "url": img.url,
                        "width": img.width,
                        "height": img.height
                    }
                }});
            }
        });
    }
}
module.exports = SongInfo;
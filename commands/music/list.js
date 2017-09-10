const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: ""});

class List extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queueadd",
            aliases: ["qa", "qadd, add"],
            group: "music",
            memberName: "queueadd",
            description: "Adds a song to the queue",
            guildOnly: true,
            args: [{
                key: "link",
                label: "link",
                prompt: "Which song would you like to add to the queue? Just give me the link!",
                type: "string"
            }]
        });
        this.queue = [];
        this.speaking;
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            if (message.guild.voiceConnection.speaking) {
                this.speaking = true;
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
                console.log("trying playlist");
                await this.addPlaylist(message, args);
            }
            else{
                await this.addSingle(message, args, info);
                info.video_id
            }
        });
    }
    async addSingle(message, args, info) {
        console.log(info.video_id);
        this.queue.push([info.video_id, info.title]);
        if (this.speaking){
            message.reply("OK, i added: "+info.title+" to the queue!");
            console.log(this.queue.length);
            this.client.provider.set(message.guild, "queue", this.queue);
        }
        else {
            this.play(message);
        }
    }
    async addPlaylist(message, args) {
        var listId = args.link.split("list=")[1];
        console.log(listId);
        await youtubeV3.playlistItems.list({
            part: "snippet",
            playlistId: listId,
            maxResults: "50"
        }, (err, data) => {
            if (err) {
                console.log(err);
                message.reply("this is not a valid link");
            }
            else {
                console.log(data);
                data.items.forEach(item => {
                    if (item.snippet.resourceId.videoId) {
                        console.log(item.snippet.resourceId.videoId);
                        this.queue.push([item.snippet.resourceId.videoId, item.snippet.title]);
                    }
                });
                if (data.nextPageToken) {
                    this.fetchAllPages(listId, data.nextPageToken, err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("playlist fetched");
                            if (this.speaking){
                                this.client.provider.set(message.guild, "queue", this.queue);
                                console.log(this.client.provider.get(message.guild, "queue"));
                                console.log(this.client.provider.get(message.guild, "queue").length);
                            }
                            else {
                            this.play(message);
                            console.log(this.queue.length);
                            }
                        }
                    });
                }
            }
        });
    }
    async fetchAllPages(listId, PageToken, callback) {
        await youtubeV3.playlistItems.list({
            part: 'snippet',
            playlistId: listId,
            maxResults: "50",
            pageToken: PageToken
        }, (err, nextPageResults) => {
            if (err) {
                callback(err);
                return;
            }
            else{
                nextPageResults.items.forEach(item => {
                    if (item.snippet.resourceId.videoId) {
                        console.log(item.snippet.resourceId.videoId);
                        this.queue.push([item.snippet.resourceId.videoId, item.snippet.title]);
                    }
                });
            }
            if (nextPageResults.nextPageToken){
                this.fetchAllPages(listId, nextPageResults.nextPageToken);
            }
            else{
                callback(null);
            }
        });
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
        /*message.guild.voiceConnection.dispatcher.on("error", error => {
            console.log(error);
            this.onEnd(message);
        });*/
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
module.exports = List;
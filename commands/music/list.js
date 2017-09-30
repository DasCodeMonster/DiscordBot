const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});
const Song = require("./Song");

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
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            await this.validation(message, args);
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
        var test = await ytdl.validateId(args.link);
        console.log(test);
        await ytdl.getInfo(args.link, async(err, info) => {
            if (err) {
                console.log(err);
                console.log("trying playlist");
                await this.addPlaylist(message, args);
            }
            else{
                await this.addSingle(message, args, info);
            }
        });
    }
    async addSingle(message, args, info) {
        console.log(info.author.name);
        console.log(info.length_seconds);
        this.queue.push([info.video_id, info.title]);
        //this.queue.push(new Song(info.video_id, info.title, info.author.name, info.length_seconds));
        if (message.guild.voiceConnection.dispatcher){
            message.reply("OK, i added: "+info.title+" to the queue!");
            console.log(this.queue.length);
            this.client.provider.set(message.guild, "queue", this.queue);
        }
        else {
            this.play(message);
        }
        console.log(info.video_id);
        await youtubeV3.videos.list({
            part: "snippet, contentDetails",
            id: info.video_id
        }, (err, data) => {
            if (err) console.log(err);
            else {
                console.log(data.items);
                data.items.forEach(item => {
                        console.log(item);
                        console.log(item.contentDetails.duration);
                        var duration = item.contentDetails.duration.split(/([PYMDTHS]+)/);
                        console.log(duration);
                        duration = duration.splice(/([0-9]+)/);
                        console.log(duration);
                        var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, item.contentDetails.duration, message.member.id);
                        console.log(song);
                        //this.queue.push([item.snippet.resourceId.videoId, item.snippet.title]);
                        //this.queue.push(new Song(item.snippet.resourceId.videoId, item.snippet.title));
                });
            }
        });
    }
    async addPlaylist(message, args) {
        var listId = args.link.split("list=")[1];
        console.log(listId);
        await youtubeV3.playlistItems.list({
            part: "snippet, contentDetails",
            playlistId: listId,
            maxResults: "50"
        }, (err, data) => {
            if (err) {
                console.log(err);
                message.reply("this is not a valid link");
            }
            else {
                data.items.forEach((item) => {
                    console.log(item);
                    if (item.snippet.resourceId.video_id) {
                        youtubeV3.videos.list({
                            part: "snippet, contentDetails",
                            id: item.snippet.video_id
                        }, (err, data) => {
                            if (err) console.log(err);
                            else {
                                console.log(data.items);
                                data.items.forEach(item => {
                                        console.log(item);
                                        console.log(item.contentDetails.duration);
                                        var duration = item.contentDetails.duration.split(/([PYMDTHS]+)/);
                                        console.log(duration);
                                        duration = duration.splice(/([0-9]+)/);
                                        console.log(duration);
                                        var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, item.contentDetails.duration, message.member.id);
                                        console.log(song);
                                        //this.queue.push([item.snippet.resourceId.videoId, item.snippet.title]);
                                        this.queue.push(new Song(item.snippet.resourceId.videoId, item.snippet.title));
                                });
                            }
                        });
                    }
                });
                if (data.nextPageToken) {
                    this.fetchAllPages(listId, data.nextPageToken, err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("playlist fetched");
                            if (message.guild.voiceConnection.dispatcher){
                                this.client.provider.set(message.guild, "queue", this.queue);
                                console.log(this.client.provider.get(message.guild, "queue"));
                                console.log(this.client.provider.get(message.guild, "queue").length);
                            }
                            else {
                            //this.play(message);
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
                nextPageResults.items.forEach((item) => {
                    if (item.snippet.resourceId.videoId) {
                        youtubeV3.videos.list({
                            part: "snippet, contentDetails",
                            id: item.snippet.video_id
                        }, (err, data) => {
                            if (err) console.log(err);
                            else {
                                console.log(data.items);
                                data.items.forEach(item => {
                                        console.log(item);
                                        console.log(item.contentDetails.duration);
                                        var duration = item.contentDetails.duration.split(/([PYMDTHS]+)/);
                                        console.log(duration);
                                        duration = duration.splice(/([0-9]+)/);
                                        console.log(duration);
                                        var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, item.contentDetails.duration, message.member.id);
                                        console.log(song);
                                        //this.queue.push([item.snippet.resourceId.videoId, item.snippet.title]);
                                        //this.queue.push(new Song(item.snippet.resourceId.videoId, item.snippet.title));
                                });
                            }
                        });
                    }
                });
            }
            if (nextPageResults.nextPageToken){
                this.fetchAllPages(listId, nextPageResults.nextPageToken, callback);
            }
            else{
                callback(null);
            }
        });
    }
    async play(message) {
        if (this.queue.length > 0) {
            var vid = this.queue.splice(0, 1);
            console.log(vid);
            this.client.provider.set(message.guild, "queue", this.queue);
            try {
                var stream = ytdl(vid.ID);
                var info = await ytdl.getInfo(vid.ID).catch(err => {
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
    }
    async onEnd(message) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            await ytdl.getInfo(queue[0].ID, async (err, info) => {
                if (err) {
                    console.log(err);
                    queue.splice(0, 1);
                    await this.client.provider.set(message.guild, "queue", queue);
                    this.onEnd(message);
                    return;
                }
                else {
                    var stream = await ytdl(queue[0].ID, {filter: "audioonly"});
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
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
            aliases: ["qa", "qadd", "add"],
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
        this.IDs = [];
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            await this.validation(message, args);
        }
        else {
            if (message.member.voiceChannel) {
                console.log(await ytdl.validateId(args.link));
                if (await ytdl.validateId(args.link)) {
                    message.member.voiceChannel.join();
                    await this.validation(message, args);
                }
                else {
                    this.validation(message, args);
                }
            }
            else {
                message.reply("you need to join a voicechannel first");
            }
        }
    }
    async validation(message, args) {
        var ID = args.link.split(/([v=&])+/)[2];
        console.log(ID);
        if(ytdl.validateId(ID)) {
            this.addSingle(message, args, ID);
        }
        else {
            console.log("trying playlist");
            this.addPlaylist(message, args, ID);
        }
    }
    async addSingle(message, args, ID) {
        await youtubeV3.videos.list({
            part: "snippet, contentDetails",
            id: ID
        }, (err, data) => {
            if (err) console.log(err);
            else {
                data.items.forEach(item => {
                    console.log(item);
                    console.log(item.contentDetails.duration);
                    //var duration = item.contentDetails.duration.split(/([PYMDTHS]+)/);
                    //console.log(duration);
                    //duration = duration.splice(/([0-9]+)/);
                    //console.log(duration);
                    var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, item.contentDetails.duration, message.member.id);
                    console.log(song);
                    this.queue.push(song);
                    if(!message.guild.voiceConnection.dispatcher) this.play(message);
                    console.log(this.queue);
                });
            }
        });
    }
    async addPlaylist(message, args, ID) {
        //var listId = args.link.split("list=")[1];
        console.log(ID);
        await youtubeV3.playlistItems.list({
            part: "snippet",
            playlistId: ID,
            maxResults: "50"
        }, (err, data) => {
            if (err) {
                console.log(err);
                message.reply("this is not a valid link");
            }
            else {
                if (!message.guild.voiceConnection){
                    message.member.voiceChannel.join();
                }
                var firstPage = [];
                data.items.forEach((item) => {
                    console.log(item);
                    if (item.snippet.resourceId.videoId) {
                        firstPage.push(item.snippet.resourceId.videoId);
                    }
                });
                console.log(firstPage.length);
                this.IDs.push(firstPage);
                if (data.nextPageToken) {
                    this.fetchAllPages(ID, data.nextPageToken, err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("playlist fetched");
                            console.log(this.IDs);
                            this.IDs.forEach(page => {
                                youtubeV3.videos.list({
                                    part: "snippet, contentDetails",
                                    id: this.IDs[0].join(", ")
                                }, (err, data) => {
                                    if (err) console.log(err);
                                    else {
                                        data.items.forEach(item => {
                                            console.log(item);
                                            console.log(item.contentDetails.duration);
                                            //var duration = item.contentDetails.duration.split(/([PYMDTHS]+)/);
                                            //console.log(duration);
                                            //duration = duration.splice(/([0-9]+)/);
                                            //console.log(duration);
                                            var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, item.contentDetails.duration, message.member.id);
                                            console.log(song);
                                            this.queue.push(song);
                                            if(!message.guild.voiceConnection.dispatcher) this.play(message);
                                            console.log(this.queue);
                                        });
                                    }
                                });
                            });
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
                console.log("test");
                var page = [];
                nextPageResults.items.forEach((item) => {
                    if (item.snippet.resourceId.videoId) {
                        page.push(item.snippet.resourceId.videoId);
                    }
                });
                console.log(page.length);
                this.IDs.push(page);
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
            var vid = this.queue.splice(0, 1)[0];
            console.log(vid.ID);
            this.client.provider.set(message.guild, "queue", this.queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                this.onEnd(message);
            });
        }
    }
    async onEnd(message) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            var vid = queue[0];
            console.log(vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            queue.splice(0, 1);
            this.client.provider.set(message.guild, "queue", queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
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
module.exports = List;
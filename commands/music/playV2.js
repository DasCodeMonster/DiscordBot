const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});
const Song = require("./Song");

class Play extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            group: "music",
            memberName: "play",
            description: "plays a song",
            guildOnly: true,
            args: [{
                key: "link",
                label: "link",
                prompt: "Which song would you like to play? Just give me the link or search for a song!",
                type: "string"
            }]
        });
        this.queue = [];
        this.IDs = [];
        this.pages = 0;
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            await this.validation(message, args);
        }
        else {
            if (message.member.voiceChannel) {
                console.log(await ytdl.validateURL(args.link));
                if (await ytdl.validateURL(args.link)) {
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
        if(ID && ytdl.validateURL(ID)) {
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
                    if (this.queue.length>1){
                        this.queue.splice(1,0,this.song(message, args, item));
                    }
                    else {
                        this.queue.push(this.song(message, args, item));                        
                    }
                });
                if(message.guild.voiceConnection.dispatcher) message.guild.voiceConnection.dispatcher.end("!play");
                else this.play(message);                
            }
        });
    }
    async addPlaylist(message, args, ID) {
        //var listId = args.link.split("list=")[1];
        var i = 0;        
        var Data = [];
        console.log(ID);
        await youtubeV3.playlistItems.list({
            part: "snippet",
            playlistId: ID,
            maxResults: "50"
        }, (err, data) => {
            if (err) {
                console.log(err);
                this.search(message, args);
                //message.reply("this is not a valid link");
                return;
            }
            else {
                if (!message.guild.voiceConnection){
                    message.member.voiceChannel.join();
                }
                console.log(data);
                var firstPage = [];
                data.items.forEach((item, index) => {
                    console.log(item);
                    if (item.snippet.resourceId.videoId && ytdl.validateURL(item.snippet.resourceId.videoId)) {
                        firstPage.push(item.snippet.resourceId.videoId);
                    }
                    if (index === data.items.length-1) {
                        console.log(firstPage.length);
                        this.IDs.push(firstPage);
                        this.pages +=1;
                        if (data.nextPageToken) {
                            this.fetchAllPages(ID, data.nextPageToken, err => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("playlist fetched");
                                    console.log(this.IDs);
                                    //this.IDs.reverse();
                                    this.IDs.forEach((page, index) => {
                                        youtubeV3.videos.list({
                                            part: "snippet, contentDetails",
                                            id: page.join(", ")
                                        }, (err, data) => {
                                            if (err) console.log(err);
                                            else {
                                                console.log(`\n${index}\n${page}\n${page.length}\n`);
                                                var songs = [];
                                                data.items.forEach(item => {
                                                    songs.push(this.song(message, args, item));
                                                });
                                                Data.splice(index,0,songs);
                                                i+=1;
                                                console.log(i);
                                                console.log(this.pages);
                                                console.log(i === this.pages);
                                                console.log(i == this.pages);
                                                if (i === this.pages) {
                                                    console.log("ok");
                                                    Data.reverse();
                                                    Data.forEach((songs, index) => {
                                                        songs.reverse();
                                                        songs.forEach((song, index) => {
                                                            this.queue.splice(1,0,song);
                                                        });
                                                    });
                                                    console.log(this.queue);
                                                    if (message.guild.voiceConnection.dispatcher) message.guild.voiceConnection.dispatcher.end("!play");
                                                    else this.play(message);
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        else {
                            console.log(firstPage);
                            firstPage.reverse();
                            youtubeV3.videos.list({
                                part: "snippet, contentDetails",
                                id: firstPage.join(", ")
                            }, (err, data) => {
                                if (err) console.log(err);
                                else {
                                    var songs = [];
                                    data.items.forEach(item => {
                                        songs.push(this.song(message, args, item));
                                    });
                                    i+=1;
                                    if (i === this.pages) {
                                        songs.forEach((song, index) => {
                                            console.log(song);
                                            this.queue.splice(1,0,song);
                                        });
                                        console.log(this.queue);
                                        if(message.guild.voiceConnection.dispatcher) message.guild.voiceConnection.dispatcher.end("!play");
                                        else this.play(message);
                                    }
                                }
                            });
                        }
                    }
                });
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
                nextPageResults.items.forEach((item, index) => {
                    if (item.snippet.resourceId.videoId) {
                        page.push(item.snippet.resourceId.videoId);
                    }
                    if (index === nextPageResults.items.length-1) {
                        console.log(page.length);
                        this.IDs.push(page);
                        this.pages += 1;
                        if (nextPageResults.nextPageToken){
                            this.fetchAllPages(listId, nextPageResults.nextPageToken, callback);
                        }
                        else{
                            callback(null);
                        }
                    }
                });
            }
        });
    }
    async search(message, args) {
        youtubeV3.search.list({
            part: "snippet",
            type: "video",
            maxResults: 5,
            q: args.link
        }, (err, data) => {
            if (err) {
                console.log(err);
                message.reply("an error occured!");
            }
            else {
                console.log(data);
                var messageBuilder = "you searched for:" + args.link + "\n```"
                data.items.forEach((item, index) => {
                    messageBuilder += `${index+1} Title: ${item.snippet.title} Channel:${item.snippet.channelTitle}\n`;
                });
                messageBuilder += "```"
                console.log(messageBuilder);
                this.waitForMessage(message, args, messageBuilder, data)
            }
        });
    }
    async waitForMessage(message, args, oneLiner, response) {
        var commandmsg = await message.reply("type the number of the song to play:\n"+oneLiner+"Respond with ``cancel`` to cancel the command.\n"+
            "The command will automatically be cancelled in 30 seconds, unless you respond.");
        const responses = await message.channel.awaitMessages(msg2 => {
            if (msg2.author.id === message.author.id) {
                console.log(msg2.id);
                msg2.delete();
                return true;
            }}, {
            maxMatches: 1,
            time: 30000,
            errors: ["time"]
        });
        var value;
        if(responses && responses.size === 1) value = responses.first().content; else return null;
        if(value.toLowerCase() === 'cancel') {
            commandmsg.delete();
            return null;
        }
        commandmsg.delete();
        console.log(value);
        console.log(response.items[value-1].id.videoId);
        await message.member.voiceChannel.join();
        this.addSingle(message, args, response.items[value-1].id.videoId);
    }
    song(message, args, item) {
        var match = /PT((\d+)H)?((\d+)M)?((\d+)S)?/.exec(item.contentDetails.duration)
        var tmp = ""
        if (match[2]) {
            tmp += match[2] + ":"
        }
        if (match[4]) {
            tmp += ("00" + match[4]).slice(-2) + ":"
        } else {
            tmp += "00:"
        }
        if (match[6]) {
            tmp += ("00" + match[6]).slice(-2)
        } else {
            tmp += "00"
        }
        //console.log(tmp);
        var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, tmp, message.member.id);
        //console.log(song);
        //this.queue.push(song);
        //if(!message.guild.voiceConnection.dispatcher) this.play(message);
        //console.log(this.queue);
        return song;
    }
    async play(message) {
        if (this.queue.length > 0) {
            //var vid = this.queue.splice(0, 1)[0];
            var vid = this.queue[0];
            console.log(vid.ID);
            this.client.provider.set(message.guild, "queue", this.queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume") >= 0) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                this.onEnd(message, reason);
            });
        }
    }
    async onEnd(message, reason) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue") && this.client.provider.get(message.guild, "queue").length > 1) {
            var queue = await this.client.provider.get(message.guild, "queue");
            if (reason && reason !== "!skip") {
                if (await this.client.provider.get(message.guild, "song", false)) {

                } else {
                    var vidold = queue.splice(0, 1)[0];
                    if (await this.client.provider.get(message.guild, "list", false)){
                        queue.push(vidold);
                    }
                }
            }
            else {
                var vidold = queue.splice(0, 1)[0];
                if (await this.client.provider.get(message.guild, "list", false)){
                    queue.push(vidold);
                }              
            }
            var vid = queue[0];
            console.log(vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume") >= 0) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
            this.client.provider.set(message.guild, "queue", queue);
            this.client.provider.set(message.guild, "nowPlaying", vid);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                if (reason) console.log(reason);
                this.onEnd(message, reason);
            });
        }
        else {
            var empty = [];
            this.client.provider.set(message.guild, "queue", empty);
            console.log("queue is empty");
            return;
        }
    }
}
module.exports = Play;
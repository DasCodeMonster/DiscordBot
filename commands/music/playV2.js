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
        if(ID && ytdl.validateId(ID)) {
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
                    this.song(message, args, item);
                });
                if(!message.guild.voiceConnection.dispatcher) this.play(message);                
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
                //message.reply("this is not a valid link");
                this.search(message, args);
            }
            else {
                if (!message.guild.voiceConnection){
                    message.member.voiceChannel.join();
                }
                var firstPage = [];
                data.items.forEach((item) => {
                    //console.log(item);
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
                            this.IDs.reverse();
                            this.IDs.forEach(page => {
                                page.reverse();
                                youtubeV3.videos.list({
                                    part: "snippet, contentDetails",
                                    id: page.join(", ")
                                }, (err, data) => {
                                    if (err) console.log(err);
                                    else {
                                        //data.items.reverse();
                                        console.log(data);
                                        console.log("fertig");
                                        data.items.forEach(item => {
                                            this.song(message, args, item);
                                        });
                                        console.log(page);
                                        console.log(this.IDs[this.IDs.length-1]);
                                        console.log(this.IDs[this.IDs.length-1] == page);
                                        if(!message.guild.voiceConnection.dispatcher && page == this.IDs[this.IDs.length-1]) this.play(message);                                        
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
                var page = [];
                nextPageResults.items.forEach((item) => {
                    if (item.snippet.resourceId.videoId) {
                        page.push(item.snippet.resourceId.videoId);
                    }
                });
                console.log(page.length);
                this.IDs.push(page);
                page = [];
            }
            if (nextPageResults.nextPageToken){
                this.fetchAllPages(listId, nextPageResults.nextPageToken, callback);
            }
            else{
                callback(null);
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
                    messageBuilder += `${index+1} ${item.snippet.title}\n`;
                });
                messageBuilder += "```"
                console.log(messageBuilder);
                this.waitForMessage(message, args, messageBuilder, data)
            }
        });
    }
    async waitForMessage(message, args, oneLiner, response) {
        console.log(oneLiner);
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
        message
        commandmsg.delete();
        console.log(value);
        console.log(response.items[value-1].id.videoId);
        await message.member.voiceChannel.join();
        this.addSingle(message, args, response.items[value-1].id.videoId);
    }
    song(message, args, item) {
        console.log(item);
        console.log(item.contentDetails.duration);
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
        console.log(tmp);
        var song = new Song(item.id, item.snippet.title, item.snippet.channelTitle, tmp, message.member.id);
        console.log(song);
        this.queue.splice(0,0,song);
        console.log(this.queue);
        console.log(this.queue.length);
    }
    async play(message) {
        if (this.queue.length > 0) {
            //var vid = this.queue.splice(0, 1)[0];
            var vid = this.queue[0];
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
            var vid = queue.splice(0, 1)[0];
            var vid = queue[0];
            console.log(vid);
            message.guild.voiceConnection.playStream(ytdl(vid.ID, {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            message.channel.send("Now playing: "+vid.title);
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
module.exports = Play;
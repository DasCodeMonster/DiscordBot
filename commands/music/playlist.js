const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: ""});

class Playlist extends commando.Command {
    constructor(client) {
        super(client, {
            name: "p",
            group: "music",
            memberName: "p",
            description: "testing",
            guildOnly: true,
            args: [{
                key: "link",
                label: "link",
                prompt: "link!",
                type: "string"
            }]
        });
        this.queue = [];
    }
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            if (message.guild.voiceConnection.speaking) {
                var result = await this.validation(message, args);
                if (!result) return;
                else {
                    this.client.provider.set(message.guild, "queue");
                }
            }
            else{
                var result = await this.validation(message, args);
                if (!result) return;
                else {
                    this.play(message);           
                }
            }
        }
        else {
            if (message.member.voiceChannel) {
                var result = await this.validation(message, args);
                //console.log(result);
                if (!result) return;
                else {
                    message.member.voiceChannel.join();
                    this.play(message);
                }
            }
            else {
                message.reply("you need to join a voicechannel first");
            }
        }
    }
    async validation(message, args) {
        var toReturn;
        await ytdl.getInfo(args.link, async(err, info) => {
            if (err) {
                console.log(err);
                console.log("trying playlist");
                toReturn = await this.addPlaylist(message, args);
            }
            else{
                toReturn = await this.addSingle(message, args);
                console.log(toReturn);
            }
        });
        console.log(toReturn);
        return toReturn;
    }
    async addSingle(message, args) {
        var info = await ytdl.getInfo(args.link);
        this.queue.push(info.video_id);
        return true;
    }
    async addPlaylist(message, args) {
        var listId = args.link.split("list=")[1];
        console.log(listId);
        var toReturn;
        var listdata;
        await youtubeV3.playlistItems.list({
            part: "snippet",
            playlistId: listId,
            maxResults: "50"
        }, (err, data) => {
            if (err) {
                console.log(err);
                message.reply("this is not a valid link");
                toReturn = false;
            }
            else {
                console.log(data);
                listdata = data;
                data.items.forEach(item => {
                    console.log(item.snippet.resourceId.videoId);
                    this.queue.push(item.snippet.resourceId.videoId);
                });
                if (data.pageInfo.totalResults > 50) {
                    this.fetchAllPages(listId, data.nextPageToken);
                }
                toReturn = true;
            }
        });
    }
    async fetchAllPages(listId, PageToken) {
        await youtubeV3.playlistItems.list({
            part: 'snippet',
            playlistId: listId,
            maxResults: "50",
            pageToken: PageToken
        }, (err, nextPageResults) => {
            if (err) return;
            else{
                nextPageResults.items.forEach(item => {
                    this.queue.push(item.videoId);
                    console.log(item.videoId);
                });
            }
            if (nextPageResults.nextPageToken){
                this.fetchAllPages(listId, nextPageResults.nextPageToken);
            }
        });
    }
    async onEnd(message) {
        console.log("File ended");
        if (this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            message.guild.voiceConnection.playStream(await ytdl(queue[0], {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            var info = await ytdl.getInfo(queue[0])
            message.channel.send("Now playing: "+info.title);
            var rest = queue.splice(0, 1);
            this.client.provider.set(message.guild, "queue", queue);
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                onEnd(message);
            });
        }
        else {
            console.log("queue is empty");
            return;
        }
    }
    async play(message) {
        var vidID = this.queue.splice(0, 1);
        this.client.provider.set(message.guild, "queue");
        var stream = ytdl(vidID);
        var info = await ytdl.getInfo(vidID);
        message.guild.voiceConnection.playStream(stream);
        if (client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(client.provider.get(message.guild, "volume"));
        else message.guild.voiceConnection.dispatcher.setVolume(0.3);
        message.channel.send("Now playing: "+info.title);
        message.guild.voiceConnection.dispatcher.on("end", reason => {
            this.onEnd(message);
        });
    }
}
module.exports = Playlist;
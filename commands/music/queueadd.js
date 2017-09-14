const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});


class QueueAddold extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queueaddold",
            group: "music",
            memberName: "queueaddold",
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
    /**
     * 
     * @param {Message} message 
     * @param {any} args 
     */
    async run(message, args){
        /*if (this.client.provider.get(message.guild, "queue")){
            this.queue = this.client.provider.get(message.guild, "queue");
            console.log("1. "+this.queue);
        }
        console.log(args.link);
        if (message.member.voiceChannel) {
            if (message.guild.voiceConnection) {
                if (this.client.provider.get(message.guild, "dispatcher")){
                    var validation = ytdl.getInfo(args.link, function(err, info){
                        if (err) {
                            message.reply("this is not a valid link!");
                            return;
                        }
                    });
                    const info = await ytdl.getInfo(args.link);
                    message.reply(info.title+" added to the queue");
                    this.queue.push(info.video_id);
                    console.log("2. "+this.queue);
                    this.client.provider.set(message.guild, "queue", this.queue);
                }
                else {
                    var connection = message.guild.voiceConnection;
                    const stream = ytdl(args.link,{ filter : 'audioonly' });
                    var dispatcher = connection.playStream(stream);
                    dispatcher.setVolume(this.client.provider.get(message.guild, "volume", 0.3));
                    console.log(this.client.provider.get(message.guild, "volume", 0.3))
                    const info = await ytdl.getInfo(args.link); 
                    await message.reply("now playing: "+info.title);
                    dispatcher.on("end",  async () => {
                        console.log("File ended");
                        connection = message.guild.voiceConnection;
                        var newDispatcher = this.client.provider.get(message.guild, "dispatcher");
                        var vidID = this.client.provider.get(message.guild, "queue");
                        var stream = ytdl(vidID[0], {filter:"audioonly"});
                        //console.log(stream);
                        //console.log(newDispatcher.stream);
                        newDispatcher = connection.playStream(stream);
                        if (this.client.provider.get(message.guild, "volume")) {
                            dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                        }
                        else {
                            dispatcher.setVolume(0.3);
                            this.client.provider.set(message.guild, "volume", 0.3);
                        }
                        console.log(this.client.provider.get(message.guild, "volume", 0.3))
                        var info = await ytdl.getInfo(vidID[0]);                        
                        message.reply("now playing: "+info.title);
                        vidID.splice(0,1);
                        util.inspect(newDispatcher);
                        this.client.provider.set(message.guild, "dispatcher", newDispatcher);
                    });
                    util.inspect(dispatcher);
                    this.client.provider.set(message.guild, "dispatcher", dispatcher);
                }
            }
            else {
                var connection = await message.member.voiceChannel.join();
                const stream = ytdl(args.link, {filter: "audioonly"});
                var dispatcher = connection.playStream(stream);
                if (this.client.provider.get(message.guild, "volume")) {
                    console.log(this.client.provider.get(message.guild, "volume"));                 
                    dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                }
                else {
                    dispatcher.setVolume(0.3);
                    console.log("default");
                    this.client.provider.set(message.guild, "volume", 0.3);
                }
                console.log(this.client.provider.get(message.guild, "volume", 0.3))
                const info = await ytdl.getInfo(args.link);
                await message.reply("now playing: "+info.title);
                dispatcher.on("end", async () => {
                    console.log("File ended");
                    connection = message.guild.voiceConnection;
                    var newDispatcher = this.client.provider.get(message.guild, "dispatcher");
                    var vidID = this.client.provider.get(message.guild, "queue");
                    var stream = ytdl(vidID[0], {filter:"audioonly"});
                    newDispatcher = connection.playStream(stream);
                    if (this.client.provider.get(message.guild, "volume")) {
                        dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                    }
                    else {
                        dispatcher.setVolume(0.3);
                        this.client.provider.set(message.guild, "volume", 0.3);
                    }
                    console.log(this.client.provider.get(message.guild, "volume", 0.3))
                    var info = await ytdl.getInfo(vidID[0]);                    
                    message.reply("now playing: "+info.title);
                    vidID.splice(0,1);
                    util.inspect(newDispatcher);
                    this.client.provider.set(message.guild, "dispatcher", newDispatcher);
                });
                util.inspect(dispatcher);
                this.client.provider.set(message.guild, "dispatcher", dispatcher);
            }
        }
        else {
            message.reply("you need to join a voicechannel first.")
        }*/
        if (this.client.provider.get(message.guild, "queue")) this.queue = await this.client.provider.get(message.guild, "queue");
        console.log(this.queue);
        console.log(args.link);
        var validation = await ytdl.getInfo(args.link, function(err, info){
            if (err) {
                //message.reply("this is not a valid link!");
                //console.log("invalid link");
                console.log(err);
                return false;
            }
            else {
                console.log("valid link");
            }
        });
        console.log(validation);
        if (validation == false) {
            //await addPlaylist(args.link, this.client, message);
            console.log(this.client.provider.get(message.guild, "queue"));
            if (message.guild.voiceConnection){
                await this.playlist(message, args);
                console.log(this.client.provider.get(message.guild, "queue"));
                if (message.guild.voiceConnection.speaking) return;
                else {
                    try{
                        //console.log(this.client.provider.get(message.guild, "queue"));
                        var queue = this.client.provider.get(message.guild, "queue");
                        var stream = await ytdl(queue[0], {filter: "audioonly"});
                        var vidInfo = await ytdl.getInfo(queue[0]);                        
                        this.play(message, stream, vidInfo);
                        queue.splice(0,1);
                        this.client.provider.set(message.guild, "queue", queue);
                    }
                    catch (err){
                        console.log(err);
                    }
                }
            }
            else{
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join();
                    await this.playlist(message, args);
                    try{
                        //console.log(this.client.provider.get(message.guild, "queue"));
                        var queue = this.client.provider.get(message.guild, "queue");
                        console.log(queue);
                        var stream = await ytdl(queue[0], {filter: "audioonly"});
                        var vidInfo = await ytdl.getInfo(queue[0]);                        
                        this.play(message, stream, vidInfo);
                        queue.splice(0,1);
                        this.client.provider.set(message.guild, "queue", queue);
                    }
                    catch (err){
                        console.log(err);
                    }
                }
            }
            return;
        }
        var vidInfo = await ytdl.getInfo(args.link);
        var vidID = vidInfo.video_id;
        var stream = await ytdl(vidID, {filter: "audioonly"});
        if (message.guild.voiceConnection) {
            if (message.guild.voiceConnection.speaking) {
                if (vidID){
                    console.log("speaking")
                    this.queue.push(vidID);
                    console.log(this.queue);
                    this.client.provider.set(message.guild, "queue", this.queue);
                    console.log(this.client.provider.get(message.guild, "queue"));                    
                    message.channel.send("I added "+'"'+vidInfo.title+'"'+" to the queue!");
                }
            }
            else {
                this.play(message, stream);
            }
        }        
        else {
            if (message.member.voiceChannel) {
                await message.member.voiceChannel.join();
                this.play(message, stream);   
            }
            else {
                message.reply("you need to join a voiceChannel first!");
            }
        }
    }
    async playlist(message, args) {
        var listId = args.link.split("list=")[1];
        console.log(listId);
        if (this.client.provider.get(message.guild, "queue")) {
            this.queue = await this.client.provider.get(message.guild, "queue");
        }
        await youtubeV3.playlistItems.list({
            part: 'snippet',
            playlistId: 'PL2HX79P_2flhzjLjma7NcLoTsMyq167E0',
            maxResults: "50"
          }, async (err, results) => {
            if (err) return;
            console.log(results.pageInfo.totalResults);
            var pages = results.pageInfo.totalResults/50;
            pages = Math.ceil(pages);
            console.log(pages);
            for (var items in results.items) {
                this.queue.push(results.items[items].snippet.resourceId.videoId);
            }
            //this.client.provider.set(message.guild, "queue", this.queue);
            console.log(results.nextPageToken);
            await getPlaylistItems(results.nextPageToken, this.client, message, queue);
            message.reply("I added ``"+this.client.provider.get(message.guild, "queue").length+"`` songs to the queue!");

        });
        function getPlaylistItems(PageToken, client, message, queue){
            youtubeV3.playlistItems.list({
                part: 'snippet',
                playlistId: 'PL2HX79P_2flhzjLjma7NcLoTsMyq167E0',
                maxResults: "50",
                pageToken: PageToken
              }, (err, nextPageResults) => {
                if (err) return;
                console.log(nextPageResults.pageInfo.totalResults);
                var pages = nextPageResults.pageInfo.totalResults/50;
                pages = Math.ceil(pages);
                for (var items in nextPageResults.items) {
                    queue.push(nextPageResults.items[items].snippet.resourceId.videoId);
                }
                client.provider.set(message.guild, "queue", queue);
                if (nextPageResults.nextPageToken){
                getPlaylistItems(nextPageResults.nextPageToken, client, queue);
                }
                else{
                    console.log(client.provider.get(message.guild, "queue"));
                    return;   
                }
            });
        }
    }
    async play(message, stream, vidInfo){
        message.guild.voiceConnection.playStream(stream);
        if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
        else message.guild.voiceConnection.dispatcher.setVolume(0.3);
        console.log(message.guild.voiceConnection.dispatcher.volume);
        message.channel.send("Now playing: "+vidInfo.title);                
        message.guild.voiceConnection.dispatcher.on("end", reason => {
            this.onEnd(message);
        });
    }
    async onEnd(message) {
        console.log("File ended");
        console.log(this.client.provider.get(message.guild, "queue"));
        console.log(this.client.provider.get(message.guild, "queue").length);
        if (this.client.provider.get(message.guild, "queue").length > 0) {
            var queue = await this.client.provider.get(message.guild, "queue");
            message.guild.voiceConnection.playStream(await ytdl(queue[0], {filter: "audioonly"}));
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            console.log(message.guild.voiceConnection.dispatcher.volume);
            var info = await ytdl.getInfo(queue[0])
            message.channel.send("Now playing: "+info.title);
            var rest = queue.splice(0, 1);
            console.log("rest: "+rest);
            console.log(queue);
            this.client.provider.set(message.guild, "queue", queue);
            console.log(this.client.provider.get(message.guild, "queue"));                
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                this.onEnd(message);
            });
        }
        else {
            console.log("queue is empty");
            return;
        }
    }
}
const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: ""});

class PlayCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            group: "music",
            memberName: "play",
            description: "let the bot play a youtubevideo.",
            details: "the bot needs to be in a voicechannel.",
            guildOnly: true,
            args: [{
                key: 'link',
                label: 'link',
                prompt: 'Which song would you like to play? You only need to give the link to the video.',
                type: 'string'
            }]
        })
    }

    //async run(message, args) {
        //console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);
        /*var connection;
        var dispatcher;
        try {
            if (message.guild.voiceConnection){
                connection = message.guild.voiceConnection;
                const stream = ytdl(args.link,{ filter : 'audioonly' });
                dispatcher = connection.playStream(stream);
                if (this.client.provider.get(message.guild, "volume")) {
                    dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                }
                else {
                    dispatcher.setVolume(0.3);
                    this.client.provider.set(message.guild, "volume", 0.3);
                }
                console.log(this.client.provider.get(message.guild, "volume", 0.3))
                const info = await ytdl.getInfo(args.link); 
                await message.reply("now playing: "+info.title);
            }
            else {
                if (message.member.voiceChannel) {
                    connection = await message.member.voiceChannel.join();
                    const stream = ytdl(args.link, {filter: "audioonly"});
                    dispatcher = connection.playStream(stream);
                    if (this.client.provider.get(message.guild, "volume")) {
                        dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                    }
                    else {
                        dispatcher.setVolume(0.3);
                        this.client.provider.set(message.guild, "volume", 0.3);
                    }
                    const info = await ytdl.getInfo(args.link);
                    await message.reply("now playing: "+info.title);
                } else {
                    await message.reply("You need to be in a voicechannel!");
                }
            }
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
                var info = await ytdl.getInfo(vidID[0]);
                message.reply("now playing: "+info.title);
                vidID.splice(0,1);
                util.inspect(newDispatcher);
                this.client.provider.set(message.guild, "dispatcher", newDispatcher);
            });
            util.inspect(dispatcher);
            this.client.provider.set(message.guild, "dispatcher", dispatcher); 
        }
        catch (e) {
            var saveResponse;
            var resultmsg;
            var oneLiner = "you searched for:" +args.link+"\nResults:\n";
            var request = await youtubeV3.search.list({
                part: "snippet",
                type: "video",
                maxResults: 5,
                q: args.link,   
            }, async function(err, response){
                saveResponse = response;
                for (var i=0; i<5; i++) {
                    console.log(response.items[i].snippet.title);
                    console.log(i);
                    oneLiner += (i+1+" "+response.items[i].snippet.title+"\n");
                }
                resultmsg = await message.reply(oneLiner);                
            });
            console.log(oneLiner);
            var commandmsg = await message.reply(stripIndents`
            ${"type the number of the song to play:\n"}
            ${oneLine`
                Respond with \`cancel\` to cancel the command, or \`finish\` to finish entry.
                ${30 ? `The command will automatically be cancelled in ${30} seconds, unless you respond.` : ''}
            `}
            `);
            const responses = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                maxMatches: 1,
                time: 30000,
                errors: ["time"]
            });
            var value;
            if(responses && responses.size === 1) value = responses.first().content; else return null;
            if(value.toLowerCase() === 'cancel') {
                resultmsg.delete();
                commandmsg.delete();
                return null;
            }
            resultmsg.delete();
            commandmsg.delete();
            console.log(value);
            console.log(saveResponse.items[value-1].id.videoId);
            var vidID = saveResponse.items[value-1].id.videoId;
            if (message.guild.voiceConnection){
                connection = message.guild.voiceConnection;
                const stream = ytdl(vidID,{ filter : 'audioonly' });
                dispatcher = connection.playStream(stream);
                if (this.client.provider.get(message.guild, "volume")) {
                    dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                }
                else {
                    dispatcher.setVolume(0.3);
                    this.client.provider.set(message.guild, "volume", 0.3);
                }
                console.log(this.client.provider.get(message.guild, "volume", 0.3))
                const info = await ytdl.getInfo(vidID); 
                await message.reply("now playing: "+info.title);
            }
            else {
                if (message.member.voiceChannel) {
                    connection = await message.member.voiceChannel.join();
                    const stream = ytdl(vidID, {filter: "audioonly"});
                    dispatcher = connection.playStream(stream);
                    if (this.client.provider.get(message.guild, "volume")) {
                        console.log(this.client.provider.get(message.guild, "volume"));
                        dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                    }
                    else {
                        dispatcher.setVolume(0.3);
                        console.log("default");
                        this.client.provider.set(message.guild, "volume", 0.3);
                    }
                    const info = await ytdl.getInfo(vidID);
                    await message.reply("now playing: "+info.title);
                } else {
                    await message.reply("You need to be in a voicechannel!");
                }
            }
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
        }*/
        /*var validation = await ytdl.getInfo(args.link, function(err, info){
            if (err) {
                message.reply("this is not a valid link!");
                console.log("invalid link");
                console.log(err);
                return;
            }
            else {
                console.log("valid link");
            }
        });
        var vidInfo = await ytdl.getInfo(args.link);
        var vidID = vidInfo.video_id;
        var stream = await ytdl(vidID, {filter: "audioonly"});
        if (message.guild.voiceConnection) {
            message.guild.voiceConnection.playStream(stream);
            if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
            else message.guild.voiceConnection.dispatcher.setVolume(0.3);
            console.log(message.guild.voiceConnection.dispatcher.volume);
            message.channel.send("Now playing: "+vidInfo.title);                
            message.guild.voiceConnection.dispatcher.on("end", reason => {
                onEnd(this.client, message);
            });
        }
        else {
            if (message.member.voiceChannel) {
                await message.member.voiceChannel.join();
                message.guild.voiceConnection.playStream(stream);
                if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
                else message.guild.voiceConnection.dispatcher.setVolume(0.3);
                console.log(message.guild.voiceConnection.dispatcher.volume);
                message.channel.send("Now playing: "+vidInfo.title);                
                message.guild.voiceConnection.dispatcher.on("end", reason => {
                    onEnd(this.client, message);
                });        
            }
            else {
                message.reply("you need to join a voiceChannel first!");
            }
        }
        async function onEnd(client, message) {
            console.log("File ended");
            console.log(client.provider.get(message.guild, "queue"));
            console.log(client.provider.get(message.guild, "queue").length);
            if (client.provider.get(message.guild, "queue").length > 0) {
                var queue = await client.provider.get(message.guild, "queue");
                message.guild.voiceConnection.playStream(await ytdl(queue[0], {filter: "audioonly"}));
                if (client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(client.provider.get(message.guild, "volume"));
                else message.guild.voiceConnection.dispatcher.setVolume(0.3);
                console.log(message.guild.voiceConnection.dispatcher.volume);
                var info = await ytdl.getInfo(queue[0])
                message.channel.send("Now playing: "+info.title);
                var rest = queue.splice(0, 1);
                console.log("rest: "+rest);
                console.log(queue);
                client.provider.set(message.guild, "queue", queue);
                console.log(client.provider.get(message.guild, "queue"));                
                message.guild.voiceConnection.dispatcher.on("end", reason => {
                    onEnd(client, message);
                });
            }
            else {
                console.log("queue is empty");
                return;
            }
        }
    }*/
    async run(message, args) {
        var queue = await this.client.provider.get(message.guild, "queue");
        if (queue) this.queue = queue;
        if (message.guild.voiceConnection) {
            if (message.guild.voiceConnection.speaking) {
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
                console.log("search for vids");
                await this.search(message, args);
            }
            else{
                await this.addSingle(message, args, info);
                info.video_id
            }
        });
    }
    async addSingle(message, args, info) {
        console.log(info.video_id);
        this.queue.push(info.video_id);
        if (this.speaking){
            message.reply("OK, i added: "+info.title+" to the queue!");
            console.log(this.queue.length);
            this.client.provider.set(message.guild, "queue");
        }
        else {
            this.play(message);
        }
    }
    async search(message, args) {
        var oneLiner = "you searched for: " +args.link+"\nResults:\n"+"```";
        var request = await youtubeV3.search.list({
            part: "snippet",
            type: "video",
            maxResults: 5,
            q: args.link,   
        }, (err, response) => {
            for (var i=0; i<5; i++) {
                console.log(response.items[i].snippet.title);
                console.log(i);
                oneLiner += (i+1+" "+response.items[i].snippet.title+"\n");
            }
            oneLiner += "```";              
            this.waitForMessage(message, args, oneLiner, response);
        });
    }
    async waitForMessage(message, args, oneLiner, response) {
        console.log(oneLiner);
        var commandmsg = await message.reply("type the number of the song to play:\n"+oneLiner+"Respond with ``cancel`` to cancel the command.\n"+
            "The command will automatically be cancelled in 30 seconds, unless you respond.");
        const responses = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
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
        await this.play(message, response.items[value-1].snippet.resourceId.videoId);
    }
    async play(message, vidID) {
        this.client.provider.set(message.guild, "queue", this.queue);
        var stream = ytdl(vidID);
        var info = await ytdl.getInfo(vidID).catch(err => {
            console.log(err);
        });
        message.guild.voiceConnection.playStream(stream);
        if (this.client.provider.get(message.guild, "volume")) message.guild.voiceConnection.dispatcher.setVolume(this.client.provider.get(message.guild, "volume"));
        else message.guild.voiceConnection.dispatcher.setVolume(0.3);
        message.channel.send("Now playing: "+info.title);
        message.guild.voiceConnection.dispatcher.on("end", reason => {
            this.onEnd(message);
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
            queue.splice(0, 1);
            this.client.provider.set(message.guild, "queue", queue);
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
module.exports = PlayCommand;
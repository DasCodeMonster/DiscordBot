const commando = require("discord.js-commando");
const time = require("node-datetime");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});
const Song = require("./Song");

class TestCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'other',
            memberName: 'test',
            description: 'Just a testcommand',
            guildOnly: false    
        });
        this.queue = [];
        this.speaking;
    }
    async run(message, args) {
        var song = new Song("TestID", "TestTitle", "TestAuthor", 5189);
        console.log(song);
        message.reply(song.ID);
        message.reply(song.author);
        message.reply(song.title);
        message.reply(song.length);
        /*console.log(message.guild.voiceConnection.dispatcher.stream);
        console.log(message.guild.voiceConnection.dispatcher.time);
        console.log(message.guild.voiceConnection.dispatcher.totalStreamTime);
        console.log(message.guild.voiceConnection.dispatcher.volume);*/
    }
}
module.exports = TestCommand;
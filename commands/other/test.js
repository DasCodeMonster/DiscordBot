const commando = require("discord.js-commando");
const time = require("node-datetime");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});

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
        message.reply(time.create().format("M"));
        /*var points = setInterval(() => {
            message.channel.send(time.create().format("H:M:S"));
        }, 30000);*/


        function repeatEvery(func, interval) {
            // Check current time and calculate the delay until next interval
            var now = new Date(),
                delay = interval - now % interval;
            console.log(now);
            console.log(now%interval);
            console.log(delay);
            function start() {
                // Execute function now...
                func();
                // ... and every interval
                setInterval(func, interval);
            }
        
            // Delay execution until it's an even interval
            setTimeout(start, delay);
        }
        repeatEvery(() => {
            message.channel.send(time.create().format("H:M:S"));
        }, 600000);
    }
}
module.exports = TestCommand;
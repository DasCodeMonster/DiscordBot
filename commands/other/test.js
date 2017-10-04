const commando = require("discord.js-commando");
const time = require("node-datetime");
const ytdl = require("ytdl-core");
const keys = require('./../../Token&Keys');
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: keys.YoutubeAPIKey});
const Song = require("./Song");
const curl = require("curl");

class TestCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'other',
            memberName: 'test',
            description: 'Just a testcommand',
            guildOnly: false,
            args: [{
                key: "name",
                label: "name",
                prompt: "give name?",
                type: "string"
            }]  
        });
        this.queue = [];
        this.speaking;
    }
    async run(message, args) {
        if (args.name.match(/[A-Za-z0-9\\p{L} _\\.]+$/)){
            /*curl.get(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${args.name}/recent?api_key=${keys.riotAPI}`, (err, data) => {
                if (err) console.log(err);
                else console.log(data);
            });*/
        }
        else console.log("not valid");
    }
}
module.exports = TestCommand;
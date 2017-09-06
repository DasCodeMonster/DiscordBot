const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const google = require('googleapis');
const youtubeV3 = google.youtube({version: "v3", auth: "AIzaSyApX2CuRu1pG87gypEUcmG2gQyPAsC3bns"});

class TestCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'other',
            memberName: 'test',
            description: 'Just a testcommand',
            guildOnly: false,
            args: [{
                key: "link",
                label: "link",
                prompt: "GIMME LINK OF YT!!!!11!!",
                type: "string"
            }]
        });
    }

    async run(message, args) {
        var listId = args.link.split("list=")[1];
        console.log(listId);
        await this.client.provider.remove(message.guild, "queue");
        console.log(this.client.provider.get(message.guild, "queue"));
        if (this.client.provider.get(message.guild, "queue")) {
            var queue = await this.client.provider.get(message.guild, "queue");
        }
        else {
            var queue = [];
        }
        await youtubeV3.playlistItems.list({
            part: 'snippet',
            playlistId: 'PL2HX79P_2flhzjLjma7NcLoTsMyq167E0',
            maxResults: "50"
          }, (err, results) => {
            if (err) return;
            console.log(results.pageInfo.totalResults);
            var pages = results.pageInfo.totalResults/50;
            pages = Math.ceil(pages);
            console.log(pages);
            for (var items in results.items) {
                queue.push(results.items[items].snippet.resourceId.videoId);
                this.client.provider.set(message.guild, "queue", queue);
            }
            console.log(results.nextPageToken);
            getPlaylistItems(results.nextPageToken, this.client);
            console.log(this.client.provider.get(message.guild, "queue"));
            console.log(this.client.provider.get(message.guild, "queue").length);
        });
        function getPlaylistItems(PageToken, client){
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
                    client.provider.set(message.guild, "queue", queue);
                }
                console.log(nextPageResults.nextPageToken);
                if (nextPageResults.nextPageToken){
                getPlaylistItems(nextPageResults.nextPageToken, client);
                }
                else return;
            });
        }
    }
}
module.exports = TestCommand;
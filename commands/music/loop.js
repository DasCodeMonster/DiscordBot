const commando = require("discord.js-commando");

class Loop extends commando.Command {
    constructor(client) {
        super(client, {
            name: "loop",
            group: "music",
            memberName: "loop",
            description: "loops the playlist or the song.",
            guildOnly: true,
            args: [{
                key: "songorlist",
                label: "song Or List",
                prompt: "invalid option",
                type: "song_or_list",
                default: "default",
                infinite: false
            }, {
                key: "boolean",
                label: "boolean",
                prompt: "true or false?",
                default: "default",
                type: "optionalbool",
                infinite: false
            }]
        });
    }
    async run(message, args) {
        console.log(args);
        if (args.songorlist === "default" && args.boolean === "default") {
            message.reply(`Current settings for list: ${await this.client.provider.get(message.guild, "list")?await this.client.provider.get(message.guild, "list"):false}\nCurrent settings for song: ${await this.client.provider.get(message.guild, "song")?await this.client.provider.get(message.guild, "song"):false}`);
            
        }
        else if (args.songorlist !== "default" && args.boolean === "default") {
            message.reply(`Current settings for ${args.songorlist}: ${await this.client.provider.get(message.guild, args.songorlist)?await this.client.provider.get(message.guild, args.songorlist):false}`);
        } else if (args.songorlist !== "default" && args.boolean !== "default") {
            this.client.provider.set(message.guild, args.songorlist, args.boolean);
            message.reply(`set loop ${args.songorlist} to ${args.boolean}`);
        } else if (args.songorlist === "default" && args.boolean !== "default") {
            message.reply(`you need to be more precise! Do you want to set loop list or loop song to ${args.boolean}`);
        }
    }
}
module.exports = Loop;
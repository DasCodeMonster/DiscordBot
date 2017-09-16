const commando = require("discord.js-commando");

class Points extends commando.Command {
    constructor(client) {
        super(client, {
            name: "points",
            aliases: ["p"],
            group: "points",
            memberName: "points",
            description: "shows your score"
        });
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, message.member.id)) {
            var points = this.client.provider.get(message.guild, message.member.id);
        }
        else var points = 0;
        message.reply("you have "+points+" points!");
    }
}
module.exports = Points;
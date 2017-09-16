const commando = require("discord.js-commando");

class Give extends commando.Command {
    constructor(client) {
        super(client, {
            name: "give",
            group: "points",
            memberName: "give",
            description: "Give points to another user",
            guildOnly: true,
            argsCount: 2,
            args: [{
                key: "user",
                label: "user",
                prompt: "to which user you want to tranfer your points?",
                type: "user"
            }, {
                key: "number",
                label: "number",
                prompt: "how many points do you want to transfer?",
                type: "integer"
            }]
        })
    }
    async run(message, args) {
        console.log(args.user.username);
        if (this.client.provider.get(message.guild, message.member.id)) {
            var points = this.client.provider.get(message.guild, message.member.id);
            if (args.number > points) {
                message.reply("you dont have that much points!\nPoints: "+points);
                return;
            }
        }
        else {
            message.reply("you have no points to transfer :/");
            return;
        }
        message.reply(args.number+" points successfully transfered to "+args.user);
        this.client.provider.set(message.guild, message.member.id, points-args.number);
        if (this.client.provider.get(message.guild, args.id)) {
            var friendPoints = this.client.provider.get(message.guild, args.user.id);
        }
        else {
            var friendPoints = 0;
        }
        this.client.provider.set(message.guild, args.user.id, friendPoints+args.number);
    }
}
module.exports = Give;
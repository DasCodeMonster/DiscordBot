const commando = require("discord.js-commando");

class Userinfo extends commando.Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            aliases: ["ui"],
            group: "generic",
            memberName: "userinfo",
            description: "gives you some info about the mentioned user.",
            guildOnly: true,
            args: [{
                key: "user",
                label: "user",
                prompt: "about which user do you want to have informations?",
                type: "user"
            }]
        });
    }
    async run(message, args) {
        if (args.user.avatarURL == null){
            var avatarURL = args.user.displayAvatarURL;
        }
        else var avatarURL = args.user.avatarURL;
        console.log(avatarURL);
        if (this.client.provider.get(message.guild, args.user.id)) var points = this.client.provider.get(message.guild, args.user.id);
        else var points = 0;
        message.channel.send({embed: {
            "title": args.user.username + " #"+args.user.discriminator,
            "color": 666,
            "thumbnail": {
                "url": avatarURL
            },
            "timestamp": new Date(),
            "fields": [{
                "name": "ID",
                "value": args.user.id
            }, {
                "name": "Bot",
                "value": this.isBot(args)
            }, {
                "name": "Points",
                "value": points
            }, {
                "name": "Roles",
                "value": "roles"
            }]
        }});
    }
    isBot(args) {
        if(args.user.bot) var bot = ":white_check_mark:";
        else var bot = ":x:";
        return bot;
    }
}
module.exports = Userinfo;
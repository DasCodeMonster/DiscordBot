const commando = require("discord.js-commando");

class Invite extends commando.Command {
    constructor(client) {
        super(client, {
            name: "invite",
            group: "generic",
            memberName: "invite",
            description: "sends you the invite link for the bot",
            guildOnly: false
        });
    }
    async run(message, args) {
        //message.reply("https://discordapp.com/oauth2/authorize?client_id=348037329862000640&scope=bot&permissions=0x00000008");
        message.reply(await this.client.generateInvite("0x00000008"));
    }
}
module.exports = Invite;
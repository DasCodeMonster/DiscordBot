const commando = require("discord.js-commando");

class Skip extends commando.Command {
    constructor(client) {
        super(client, {
            name: "skip",
            group: "music",
            memberName: "skip",
            description: "skip a song!",
            guildOnly: true
        });
    }
    async run(message, args) {
        message.guild.voiceConnection.dispatcher.end("skiped song");
    }
}
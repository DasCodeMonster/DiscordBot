const commando = require("discord.js-commando");

class Resume extends commando.Command {
    constructor(client) {
        super(client, {
            name: "resume",
            group: "music",
            memberName: "resume",
            description: "resumes a paused stream",
            guildOnly: true
        });
    }
    run(message, args) {
        if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
            message.guild.voiceConnection.dispatcher.resume();
            message.reply(":arrow_forward:");
        }
        else {
            message.reply("there is nothing to resume!");
        }
    }
}
module.exports = Resume;
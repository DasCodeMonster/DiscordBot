const commando = require("discord.js-commando");

class Pause extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pause",
            group: "music",
            memberName: "pause",
            description: "Pause the song which is currently playing.",
            guildOnly: true
        });
    }
    run(message, args) {
        if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
            message.guild.voiceConnection.dispatcher.pause();
            message.reply("ok I paused the music!:pause_button:");
        }
        else {
            message.reply("there is nothing to pause!");
        }
    }
}
module.exports = Pause;
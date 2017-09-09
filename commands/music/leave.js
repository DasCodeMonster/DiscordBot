const commando = require('discord.js-commando');

class LeaveVoiceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'music',
            memberName: 'leave',
            guildOnly: true,
            description: 'Let the Bot leave the VoiceChannel.'
        });
    }

    async run(message, args) {
        console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);
        if (message.guild.voiceConnection) {
            console.log("Guild: "+message.guild.name+", left voicechannel: "+message.guild.voiceConnection.channel.name);
            await message.guild.voiceConnection.channel.leave();
            await message.reply("i have left the channel.");
        }
        else {
            message.reply("I am not in a voicechannel.");
        }
    }
}
module.exports = LeaveVoiceCommand;
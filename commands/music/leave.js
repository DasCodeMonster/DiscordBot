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
            await this.client.provider.remove(message.guild, "queue");
            console.log(this.client.provider.get(message.guild, "queue"));
            await this.client.provider.set(message.guild, "queue", this.queue);
            console.log(this.client.provider.get(message.guild, "queue"));
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
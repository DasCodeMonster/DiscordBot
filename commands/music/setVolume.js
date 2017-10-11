const commando = require("discord.js-commando");

class SetVolumeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "setvolume",
            aliases: ["volume", "vol"],
            group: "music",
            memberName: "setvolume",
            description: "Set the volume of the bot",
            details: "default volume is 30",
            examples: ["!setVolume 50"],
            guildOnly: true,
            args: [{
                key: "number",
                label: "number",
                prompt: "Set the volume to a number between 0 and 100.",
                type: "integer",
                min: 0,
                max: 100,
                default: -1,
                infinte: false
            }],
            argsCount: 1
        })
    }

    async run(message, args) {
        console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);  
        if (args.number === -1) {
            message.reply(`current volume: ${this.client.provider.get(message.guild, "volume", 0.3)*100}`);
            return;
        }
        if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
            message.guild.voiceConnection.dispatcher.setVolume(args.number/100);
            console.log(args.number/100);
            this.client.provider.set(message.guild, "volume", args.number/100);
            message.reply(`set the volume to ${args.number}.`);
        }
        else {
            this.client.provider.set(message.guild, "volume", args.number/100);
            message.reply(`set the volume to ${args.number}.`);
        }
    }
}
module.exports = SetVolumeCommand;
const commando = require("discord.js-commando");
const util = require("util");
class SetVolumeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "setvolume",
            aliases: ["volume"],
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
                max: 100
            }],
            argsCount: 1
        })
    }

    async run(message, args) {
        console.log("User: "+message.member.displayName+" in Guild: "+message.guild.name+" used Command: "+this.name+" in textchannel: "+message.channel.name);  
        /*var dispatcher = this.client.provider.get(message.guild, "dispatcher");
        if (dispatcher) {
            if (args.number < 0 || args.number > 100) {
                message.reply("value must be between 0 and 100");
                return;
            }
            else {
                dispatcher.setVolume(args.number/100);
                console.log(args.number);
                var volume = args.number/100;
                volume = util.inspect(volume);
                console.log(volume);
                this.client.provider.set(message.guild, "volume", volume);
                console.log("Guild: "+message.guild.name+", Channel: "+message.guild.voiceConnection.channel.name+" set Volume to "+args.number/100);
            }
        }
        else {
            message.reply("I need to play a song first.");
        }*/
        if (message.guild.voiceConnection) {
            message.guild.voiceConnection.dispatcher.setVolume(args.number/100);
            console.log(args);
            console.log(args.number);
            console.log(args.number/100);
            this.client.provider.set(message.guild, "volume", args.number/100);
        }
        else {
            message.reply("I need to play a song first.");
        }
    }
}
module.exports = SetVolumeCommand;
const commando = require("discord.js-commando");

class RemoveRole extends commando.Command {
    constructor(client) {
        super(client, {
            name: "removerole",
            aliases: ["rr"],
            group: "generic",
            memberName: "removerole",
            guildOnly: true,
            description: 'removes a guld from the "joinable roles".',
            args: [{
                key: "role",
                label: "role",
                prompt: "which role would you like to remove from the ``joinable roles``?",
                type: "role"
            }],
            argsCount: 1
        });
        this.roles = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "joinableRoles")) this.roles = this.client.provider.get(message.guild, "joinableRoles");        
        if (this.roles.indexOf(args.role)>-1){
            message.member.removeRole(args.role);
            var index = this.roles.indexOf(args.role);
            this.roles.splice(index, 1);
            message.reply("removed "+ args.role+" from the ``joinable roles``!");
        }
        else message.reply(args.role+" is not a joinable role!");
    }
}
module.exports = RemoveRole;
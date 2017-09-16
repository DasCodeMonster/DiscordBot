const commando = require("discord.js-commando");

class JoinRole extends commando.Command {
    constructor(client) {
        super(client, {
            name: "joinrole",
            aliases: ["jr"],
            group: "generic",
            memberName: "joinrole",
            description: "join a role (needs to be a joinable role)",
            guildOnly: true,
            args: [{
                key: "role",
                label: "role",
                prompt: "which role would you like to join?",
                type: "role"
            }],
            argsCount: 1
        });
        this.roles = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "joinableRoles")) this.roles = this.client.provider.get(message.guild, "joinableRoles");
        if (this.roles.indexOf(args.role)>-1){
            message.member.addRole(args.role);
            message.reply("you joined role "+args.role+"!");
        }
        else message.reply(args.role+" is not a joinable role!");
    }
}
module.exports = JoinRole;
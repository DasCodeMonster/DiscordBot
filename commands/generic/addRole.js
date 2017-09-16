const commando = require("discord.js-commando");

class AddRole extends commando.Command {
    constructor(client) {
        super(client, {
            name: "addrole",
            aliases: ["ar"],
            group: "generic",
            memberName: "addrole",
            description: "add a role which guildmembers can join with the ``joinRole`` command",
            guildOnly: true,
            format: "!addRole @role",
            args: [{
                key: "role",
                label: "role",
                prompt: "which role would you like to add to the joinable roles?",
                type: "role"
            }],
            argsCount: 1
        });
        this.roles = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "joinableRoles")) this.roles = this.client.provider.get(message.guild, "joinableRoles");
        this.roles.push(args.role);
        this.client.provider.set(message.guild, "joinableRoles", this.roles);
        message.reply("added "+args.role+" to the ``joinable roles``!");
    }
}
module.exports = AddRole;
const commando = require("discord.js-commando");

class LeaveRole extends commando.Command {
    constructor(client) {
        super(client, {
            name: "leaverole",
            aliases: ["lr"],
            group: "generic",
            memberName: "leaverole",
            description: "leave a role",
            guildOnly: true,
            args: [{
                key: "role",
                label: "role",
                prompt: "which role would you like to leave?",
                type: "role"
            }],
            argsCount: 1
        });
    }
    async run(message, args) {
        message.member.removeRole(args.role);
        message.reply("you left role "+args.role);
    }
}
module.exports = LeaveRole;
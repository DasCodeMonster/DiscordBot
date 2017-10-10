const commando = require("discord.js-commando");

class Permission extends commando.Command {
    constructor(client) {
        super(client, {
            name: "permission",
            aliases: ["perm"],
            group: "generic",
            memberName: "permission",
            description: "you can decide which users can use which commands.",
            guildOnly: true,
            args:[{
                key: "commands",
                label: "commands",
                prompt: "PLACEHOLDER",
                type: "commandtype"
            }, {
                key: "option",
                label: "option",
                prompt: "you need to provide an option",
                type: "option"
            }, {
                key: "group",
                label: "role/user",
                prompt: "you need to mention a role or user",
                type: "role_or_user_or_channel"
            }, {
                key: "boolean",
                label: "boolean",
                prompt:"true or false?",
                type: "boolean"
            }]
        });
    }
    async run(message, args) {
        //console.log(args);
        
    }
}
module.exports = Permission;
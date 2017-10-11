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
                key: "command",
                label: "command",
                prompt: "you need to provide an command",
                type: "command"
            }, /*{
                key: "commandgroup",
                label: "commandgroup",
                prompt: "you need to give an commandgroup",
                type: "commandgroup"
            }, {
                key: "commandname",
                label: "commandname",
                prompt: "PLACEHOLDER",
                type: "commandname"
            },*/ {
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
            }],
            guarded: true
            //argsSingleQuotes: true
        });
    }
    async run(message, args) {
        console.log(args);
        
    }
}
module.exports = Permission;
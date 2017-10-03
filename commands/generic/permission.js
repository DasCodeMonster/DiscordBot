const commando = require("discord.js-commando");
const moment = require("moment");

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
                type: "string"
            }, {
                key: "option",
                label: "option",
                prompt: "you need to provide an option",
                type: "string"
            }, {
                key: "group",
                label: "role/user",
                prompt: "you need to mention a role or user",
                type: "string"
            }, {
                key: "boolean",
                label: "boolean",
                prompt:"true or false?",
                type: "boolean"
            }]
        });
    }
    async run(message, args) {
        console.log(args);
        const userType = this.client.registry.types.get('user');
        const roleType = this.client.registry.types.get('role');
        if (await userType.validate(args.group, message)) {
            const user = await userType.parse(args.group, message);
            console.log(user);
        } else if (await roleType.validate(args.group, message)) {
            const role = await roleType.parse(args.group, message);
            console.log(role);
        }
        //console.log(moment.duration("PT4M13S"));
        
        
    }
}
module.exports = Permission;
const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class CommandArgument extends ArgumentType {
    constructor(client) {
        super(client, "command");
    }
    validate(value, msg) {
        if (value.split(":").length === 2 &&value.split(":")[0] !== value && value.split(":")[1] !== value) {
            var group = value.split(":")[0];
            var commandname = value.split(":")[1]
            if (group === "*" && commandname !== "*") return false;
            if (group === "*" && commandname === "*") return true;
            if (this.validateGroup(group, msg) && commandname === "*") return true;
            if ((this.validateGroup(group, msg) || group === "*") && (this.validateCommandname(commandname, msg) || commandname === "*")) {
                return this.validateCommand(group, commandname);
            }
            else return false;
        }
        return false;
    }
    parse(value, msg) {
        if (this.validate(value, msg)) return value;
        else throw new Error("invalid command please validate fist!");
    }
    validateCommand(groupid, commandname) {
        return this.client.registry.groups.some(group => {
            if (group.id === groupid) {
                return group.commands.some(command => {
                    if (command.name === commandname) return true;
                });
            }
        });
    }
    validateGroup(value, msg) {
        return this.client.registry.groups.some(group => {
            if (group.id === value) return true;
        });
    }
    parseGroup(value, msg) {
        return value;
    }
    validateCommandname(value, msg) {
        return this.client.registry.commands.some(command => {
            if (command.name === value) return true;
        });
    }
    parseCommandname(value, msg) {
        var Command;
        var isCommand = this.client.registry.commands.some(command => {
            if (command.name === value) {
                Command = command;
                return true;
            }
        });
        if (isCommand == true) return Command;
    }
}
module.exports = CommandArgument;
const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class CommandArgument extends ArgumentType {
    constructor(client) {
        super(client, "command");
    }
    validate(value, msg) {
        console.log(value);
        if (value.split(":").length === 2 &&value.split(":")[0] !== value && value.split(":")[1] !== value) {
            var group = value.split(":")[0];
            var command = value.split(":")[1]
            console.log(group);
            console.log(command);
            console.log(this.validateGroup(group, msg));
            console.log(this.validateCommandname(command, msg));            
            if (this.validateGroup(group, msg) && this.validateCommand(command, msg)) return true;
            else return false;
        }
        //return true;
    }
    parse(value, msg) {
        return value;
    }
    validateCommand(value, msg) {
        
    }
    validateGroup(value, msg) {
        //console.log(this.client.registry.groups);
        return this.client.registry.groups.some(group => {
            //console.log(group);
            if (group.id === value) return true;
            //else return false;  
        });
        //return true;
    }
    parseGroup(value, msg) {
        return value;
    }
    validateCommandname(value, msg) {
        //console.log(this.client.registry.groups);
        //console.log(this.client.registry.commands);
        return this.client.registry.commands.some(command => {
            //console.log(command.name);
            if (command.name === value) return true;
            //else return false;  
        });
    }
    parseCommand(value, msg) {
        var Command;
        var isCommand = this.client.registry.commands.some(command => {
            if (command.name === value) {
                Command = command;
                return true;
            }
        });
        //console.log(isCommand);
        //console.log(Command);
        if (isCommand == true) return Command;
    }
}
module.exports = CommandArgument;
const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class Commandname extends ArgumentType {
    constructor(client) {
        super(client, "commandname");
    }
    validate(value, msg) {
        //console.log(this.client.registry.groups);
        //console.log(this.client.registry.commands);
        return this.client.registry.commands.some(command => {
            //console.log(command.name);
            if (command.name === value) return true;
            //else return false;  
        });
    }
    parse(value, msg) {
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
module.exports = Commandname;
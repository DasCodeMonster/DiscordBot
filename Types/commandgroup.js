const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class Commandgroup extends ArgumentType {
    constructor(client){
        super(client, "commandgroup");
    }
    validate(value, msg) {
        //console.log(this.client.registry.groups);
        return this.client.registry.groups.some(group => {
            //console.log(group);
            if (group.id === value) return true;
            //else return false;  
        });
        //return true;
    }
    parse(value, msg) {
        return value;
    }
}
module.exports = Commandgroup;
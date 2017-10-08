const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class Commandtype extends ArgumentType {
    constructor(client) {
        super(client, "commandtype");
    }
    validate(value, msg) {

    }
    parse(value, msg) {

    }
}
module.exports = Commandtype;
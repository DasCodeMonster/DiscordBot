const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class Option extends ArgumentType {
    constructor(client) {
        super(client, "option");
        this.option = new Set(["-u", "-r", "-c"]); //-g
    }
    validate(value) {
        const lc = value.toLowerCase();
        return this.option.has(lc);
    }
    parse(value) {
        const lc = value.toLowerCase();
        if (this.option.has(lc)) return lc;
        else throw new RangeError("Unknown option.");
    }
}
module.exports = Option;
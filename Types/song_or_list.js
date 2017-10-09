const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class SongOrList extends ArgumentType {
    constructor(client) {
        super(client, "song_or_list");
        this.option = new Set(["song", "list", "default"]);
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
module.exports = SongOrList;
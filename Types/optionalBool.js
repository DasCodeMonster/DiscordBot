const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class OptionalBool extends ArgumentType {
	constructor(client) {
		super(client, 'optionalbool');
		this.truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
        this.falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
        this.default = new Set(["default"]);
	}

	validate(value) {
		const lc = value.toLowerCase();
		return this.truthy.has(lc) || this.falsy.has(lc) || this.default.has(lc);
	}

	parse(value) {
		const lc = value.toLowerCase();
		if(this.truthy.has(lc)) return true;
        if(this.falsy.has(lc)) return false;
        if(this.default.has(lc)) return lc;
		throw new RangeError('Unknown boolean value.');
	}
}

module.exports = OptionalBool;

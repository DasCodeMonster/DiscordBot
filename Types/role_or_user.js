//not working
const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");

class RoleOrUser extends ArgumentType {
    constructor(client) {
        super(client, "role_or_user");
    }
    validate(value) {
        console.log(value);
        const userType = this.client.registry.types.get('user');
        console.log(userType);
        const roleType = this.client.registry.types.get('role');
        console.log(userType.validate(value));
        if (userType.validate(value)) {
            const user = userType.parse(value);
            console.log(user);
            return true;
        } else if (roleType.validate(value)) {
            const role = roleType.parse(value);
            console.log(role);
            return true;
        }
        else return false;
    }
    parse(value) {
        const userType = this.client.registry.types.get('user');
        const roleType = this.client.registry.types.get('role');
        if (userType.validate(value)) {
            const user = userType.parse(value);
            console.log(user);
            return user;
        } else if (roleType.validate(value)) {
            const role = roleType.parse(value);
            console.log(role);
            return role;
        }
        else throw new RangeError("Value is not a User or a Role.");
    }
}
module.exports = RoleOrUser;
const ArgumentType = require("../node_modules/discord.js-commando/src/types/base");
const disambiguation = require("./../node_modules/discord.js-commando/src/util").disambiguation;
const escapeMarkdown = require("discord.js").escapeMarkdown;

class RoleOrUserOrChannel extends ArgumentType {
    constructor(client) {
        super(client, "role_or_user_or_channel");
    }
    validate(value, msg) {
        if (this.userValidate(value, msg)) return true;
        else if (this.channelValidate(value, msg)) return true;
        else if (this.roleValidate(value, msg)) return true;
        else return false;
    }
    parse(value, msg) {
		if (this.userValidate(value, msg)) {
			var returnUser = {
				"type": "user",
				"value": this.userParse(value, msg)
			}
			return returnUser;
		}
        else if (this.channelValidate(value, msg)) {
			var returnChannel = {
				"type": "channel",
				"value": this.channelParse(value, msg)
			}
			return returnChannel;
		}
        else if (this.roleValidate(value, msg)) {
			var returnRole = {
				"type:": "role",
				"value": this.roleParse(value, msg)
			}
			return returnRole;
		}
    }
    userValidate(value, msg) {
        const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
		if(matches) {
			try {
				return msg.client.fetchUser(matches[1]);
			} catch(err) {
				return false;
			}
		}
		if(!msg.guild) return false;
		const search = value.toLowerCase();
		let members = msg.guild.members.filterArray(memberFilterInexact(search));
		if(members.length === 0) return false;
		if(members.length === 1) return true;
		const exactMembers = members.filter(memberFilterExact(search));
		if(exactMembers.length === 1) return true;
		if(exactMembers.length > 0) members = exactMembers;
		return members.length <= 15 ?
			`${disambiguation(
				members.map(mem => `${escapeMarkdown(mem.user.username)}#${mem.user.discriminator}`), 'users', null
			)}\n` :
			'Multiple users found. Please be more specific.';
    }
    userParse(value, msg) {
        const matches = value.match(/^(?:<@!?)?([0-9]+)>?$/);
		if(matches) return msg.client.users.get(matches[1]) || null;
		if(!msg.guild) return null;
		const search = value.toLowerCase();
		const members = msg.guild.members.filterArray(memberFilterInexact(search));
		if(members.length === 0) return null;
		if(members.length === 1) return members[0].user;
		const exactMembers = members.filter(memberFilterExact(search));
		if(exactMembers.length === 1) return members[0].user;
		return null;
    }
    roleValidate(value, msg) {
        const matches = value.match(/^(?:<@&)?([0-9]+)>?$/);
		if(matches) return msg.guild.roles.has(matches[1]);
		const search = value.toLowerCase();
		let roles = msg.guild.roles.filterArray(nameFilterInexact(search));
		if(roles.length === 0) return false;
		if(roles.length === 1) return true;
		const exactRoles = roles.filter(nameFilterExact(search));
		if(exactRoles.length === 1) return true;
		if(exactRoles.length > 0) roles = exactRoles;
		return `${disambiguation(roles.map(role => `${escapeMarkdown(role.name)}`), 'roles', null)}\n`;
    }
    roleParse(value, msg) {
        const matches = value.match(/^(?:<@&)?([0-9]+)>?$/);
		if(matches) return msg.guild.roles.get(matches[1]) || null;
		const search = value.toLowerCase();
		const roles = msg.guild.roles.filterArray(nameFilterInexact(search));
		if(roles.length === 0) return null;
		if(roles.length === 1) return roles[0];
		const exactRoles = roles.filter(nameFilterExact(search));
		if(exactRoles.length === 1) return roles[0];
		return null;
    }
    channelValidate(value, msg) {
        const matches = value.match(/^(?:<#)?([0-9]+)>?$/);
		if(matches) return msg.guild.channels.has(matches[1]);
		const search = value.toLowerCase();
		let channels = msg.guild.channels.filterArray(nameFilterInexact(search));
		if(channels.length === 0) return false;
		if(channels.length === 1) return true;
		const exactChannels = channels.filter(nameFilterExact(search));
		if(exactChannels.length === 1) return true;
		if(exactChannels.length > 0) channels = exactChannels;
		return `${disambiguation(channels.map(chan => escapeMarkdown(chan.name)), 'channels', null)}\n`;
    }
    channelParse(value, msg) {
        const matches = value.match(/^(?:<#)?([0-9]+)>?$/);
		if(matches) return msg.guild.channels.get(matches[1]) || null;
		const search = value.toLowerCase();
		const channels = msg.guild.channels.filterArray(nameFilterInexact(search));
		if(channels.length === 0) return null;
		if(channels.length === 1) return channels[0];
		const exactChannels = channels.filter(nameFilterExact(search));
		if(exactChannels.length === 1) return channels[0];
		return null;
    }
}
function memberFilterExact(search) {
	return mem => mem.user.username.toLowerCase() === search ||
		(mem.nickname && mem.nickname.toLowerCase() === search) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
}

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search) ||
		(mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
}
function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}
module.exports = RoleOrUserOrChannel;
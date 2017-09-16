const Commando = require('discord.js-commando');
const time = require("node-datetime");
const path = require('path');
const sqlite = require('sqlite');
const keys = require('./Token&Keys');

const client = new Commando.Client({
    owner: '',
    unknownCommandRespond: false
});
client.registry.registerGroup("music", "Music commands");
client.registry.registerGroup("fun", "Fun commands");
client.registry.registerGroup("other", "other commands");
client.registry.registerGroup("points", "Commands related to your points");
client.registry.registerGroup("generic", "Generic commands");
client.registry.registerDefaults();
client.registry.registerCommandsIn(path.join(__dirname, 'commands'));
client.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on("ready", () => {
    console.log("bot startet")
    function repeatEvery(func, interval) {
        // Check current time and calculate the delay until next interval
        var now = new Date(),
            delay = interval - now % interval;
        console.log(now);
        console.log(now%interval);
        console.log(delay);
        function start() {
            // Execute function now...
            func();
            // ... and every interval
            setInterval(func, interval);
        }
    
        // Delay execution until it's an even interval
        setTimeout(start, delay);
    }
    repeatEvery(() => {
        console.log(time.create().format("H:M:S"));
        client.guilds.array().forEach(Guild => {
            Guild.members.array().forEach(member => {
                if (member.user.presence.status != "online") return;
                if (client.provider.get(Guild, member.id)) var points = client.provider.get(Guild, member.id);
                else var points = 0;
                client.provider.set(Guild, member.id, points+10);
            });
        });
    }, 200000);
});
client.on("channelCreate", channel => {
    
});
client.on("channelDelete", channel => {
    
});
client.on("channelPinsUpdate", (channel, time) => {

});
client.on("channelUpdate", (oldChannel, newChannel) => {

});
client.on("clientUserSettingsUpdate", clientUserSettings => {

});
client.on("debug", info => {

});
client.on("disconnect", event => {

});
client.on("emojiCreate", emoji => {

});
client.on("emojiDelete", emoji => {

});
client.on("emojiUpdate", (oldEmoji, newEmoji) => {

});
client.on("error", error => {

});
client.on("guildBanAdd", (guild, user) => {

});
client.on("guildBanRemove", (guild, user) => {
    
});
client.on("guildCreate", Guild => {
    console.log("Serving now Guild with name: "+Guild.name);
    
});
client.on("guildDelete", Guild => {
    console.log("Not serving anymore Guild with name: "+ Guild.name);
});
client.on("guildMemberAdd", member => {

});
client.on("guildMemberAvailable", member => {

});
client.on("guildMemberRemove", member => {

});
client.on("guildMembersChunk", (members, guild) => {

});
client.on("guildMemberSpeaking", (member, speaking) => {

});
client.on("guildMemberUpdate", (oldMember, newMember) => {

});
client.on("guildUnavailable", guild => {

});
client.on("guildUpdate", (oldGuild, newGuild) => {

});
client.on("message", async message => {
    if (message.author.bot) return;
    /*var connection = message.guild.voiceConnection.dispatcher.stream.playStream();
    message.guild.voiceConnection.dispatcher.se
    message.guild.voiceConnection.dispatcher.on("end", reason => {
        console.log(reason);

    });*/
    
});
client.on("messageDelete", async message => {
    
});
client.on("messageDeleteBulk", messages => {

});
client.on("messageReactionAdd", (messageReaction, user) => {

});
client.on("messageReactionRemove", (messageReaction, user) => {

});
client.on("messageReactionRemoveAll", message => {

});
client.on("messageUpdate", (oldMessage, newMessage) => {

});
client.on("presenceUpdate", (oldMember, newMember) => {

});
client.on("reconnecting", () => {

});
client.on("roleCreate", role => {

});
client.on("roleDelete", role => {

});
client.on("roleUpdate", (oldRole, newRole) => {

});
client.on("typingStart", (channel, user) => {

});
client.on("typingStop", (channel, user) => {

});
client.on("userNoteUpdate", (user, oldNote, newNote) => {

});
client.on("userUpdate", (oldUser, newUser) => {

});
client.on("voiceStateUpdate", (oldMember, newMember) => {

});
client.on("warn", info => {

});
console.log("bot is logging in...");
client.login(keys.BotToken).catch(console.error);
console.log("bot is logged in");

process.once('SIGINT', () => {
    console.log("exiting now");
    client.guilds.array().forEach(guild => {
        console.log(client.provider.get(guild, "queue"));
        client.provider.remove(guild, "queue");
        console.log(guild.name);
        console.log(client.provider.get(guild, "queue"));
    });
    client.provider.db.close();
    client.destroy();
    process.exit(0);
});
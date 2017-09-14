const Commando = require('discord.js-commando');
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
client.registry.registerDefaults();
client.registry.registerCommandsIn(path.join(__dirname, 'commands'));
client.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on("ready", () => {
    console.log("bot startet")
})
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
    /*var memberlist = [];
    console.log(Guild.members.forEach(member => {
        console.log(member.id);
        console.log(member.user.username);
        memberlist.push({
            name: member.user.username,
            id: member.id,
            isBot: member.user.bot,
            joinedAt: member.joinedAt
        });
    }));
    console.log(memberlist);
    data["Guild"].push({name: Guild.name,
        id: Guild.id, 
        owner: {
            name: Guild.owner.displayName, 
            id: Guild.ownerID}, 
        afkChannelID: Guild.afkChannelID,
        member:memberlist,
        voice:{
            channelid: null,
            queue: [],
            volume: 0.3
        }
    });
    var newdata = JSON.stringify(data, null, 4);
    console.log(newdata);
    fs.writeFile("./data.json", newdata, function(err, data){
        if(err) throw err;
        console.log("done!");
    });
    */
});
client.on("guildDelete", Guild => {
    console.log("Not serving anymore Guild with name: "+ Guild.name);
    /*var guild = where(data.Guild, {id:Guild.id});
    var index = data.Guild.indexOf(guild[0]);
    if (index > -1) data.Guild.splice(index, 1);
    fs.writeFile("./data.json", JSON.stringify(data, null, 4), function(err, data){
        if (err) throw err;
        console.log("deletet guild with index:"+index);
    });
    */
});
client.on("guildMemberAdd", member => {
    /*var guild = where(data.Guild, {id:member.guild.id});
    guild[0].member.push({
        username:member.user.username,
        id:member.id,
        isBot: member.user.bot,
        joinedAt: member.joinedAt
    });
    fs.writeFile("./data.json", JSON.stringify(data, null, 4), function(err, data) {
        if (err) throw err;
        console.log("added member!");
    });
    */
});
client.on("guildMemberAvailable", member => {

});
client.on("guildMemberRemove", member => {
    /*var guild = where(data.Guild, {id:member.guild.id});
    console.log(guild);
    console.log(guild[0].member);
    var Member = where(guild[0].member, {id:member.id});
    console.log(Member);
    var index =  guild[0].member.indexOf(Member[0], 1);
    console.log(index);
    if (index > -1) guild[0].member.splice(index, 1);
    fs.writeFile("./data.json", JSON.stringify(data, null, 4), function(err, data){
        if (err) throw err;
        console.log("removed Member!");
    });
    */
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
    /*var guild = where(data.Guild, {id:oldGuild.id});
    console.log(guild[0].name);
    guild[0].name = newGuild.name;
    guild[0].id = newGuild.id;
    guild[0].owner = {
        name: newGuild.owner.user.username,
        id: newGuild.ownerID
    };
    guild[0].afkChannelID = newGuild.afkChannelID;
    fs.writeFile("./data.json", JSON.stringify(data, null, 4), function(err, data){
        if (err) throw err;
        console.log("updated Guild!");
    });
    */
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
const commando = require("discord.js-commando");

class Shuffle extends commando.Command {
    constructor(client) {
        super(client, {
            name: "shuffle",
            group: "music",
            memberName: "shuffle",
            description: "shuffle the queue.",
            guildOnly: true
        });
        this.queue = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "queue")) {
            this.queue = await this.client.provider.get(message.guild, "queue");
            var newQueue = await this.shuffle(this.queue);
            this.client.provider.set(message.guild, "queue", newQueue);
            message.reply("shuffled the queue!");
        }
        else {
            message.reply("the queue is empty!");
            return;
        }
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        
          // While there remain elements to shuffle...
        while (0 !== currentIndex) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        
        return array;
    }
}
module.exports = Shuffle;
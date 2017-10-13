const commando = require("discord.js-commando");

class QueueRemove extends commando.Command {
    constructor(client) {
        super(client, {
            name: "remove",
            group: "music",
            memberName: "queue remove",
            description: "Removes the queue",
            guildOnly: true
        });
        this.queue = [];
        this.newQueue = [];
    }
    async run(message, args) {
        if (this.client.provider.get(message.guild, "queue")) this.queue = this.client.provider.get(message.guild, "queue");
        //await this.client.provider.remove(message.guild, "queue");
        if (this.queue.length > 0) this.newQueue = this.queue.splice(0,1);
        await this.client.provider.set(message.guild, "queue", this.newQueue);
        console.log(this.client.provider.get(message.guild, "queue"));
        message.reply("Removed the queue!");
    }
}
module.exports = QueueRemove;
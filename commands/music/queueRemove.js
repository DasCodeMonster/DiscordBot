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
    }
    async run(message, args) {
        //this.queue = this.client.provider.get(message.guild, "queue");
        await this.client.provider.remove(message.guild, "queue");
        console.log(this.client.provider.get(message.guild, "queue"));
        await this.client.provider.set(message.guild, "queue", this.queue);
        console.log(this.client.provider.get(message.guild, "queue"));
    }
}
module.exports = QueueRemove;
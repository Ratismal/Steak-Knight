const channel = 'REPLACE_WITH_CHANNEL_ID';

const color = Math.floor(Math.random() * 0xFFFFFF);

module.exports = class ZombieWatch {
    constructor(bot) {
        this.bot = bot;
        this.send({
            title: `Greetings!`,
            description: `My name is 0x${color}, and I will be your Zombie Watcher for this evening.`
        });

        this.interval = setInterval(this.report.bind(this), 1000 * 60 * 10); // every 10 minutes, adjust as needed
    }

    get color() {
        return color;
    }

    async send(embed) {
        embed.color = color;
        await this.bot.createMessage(channel, {
            embed
        });
    }

    async report() {
        await this.send({
            description: `Hello! This is 0x${color} checking in.`
        });
    }
}
import { Client, Command, Message, Time } from 'yamdbf';
import { RichEmbed, Guild } from 'discord.js';

const { version } = require('../../../package');

const enum EmbedCode {
  'Default' = 0x000000,
  'Error' = 0xE74C3C,
  'Warn' = 0xE67E22,
  'Info' = 0x2ECC71,
  'Profile' = 0x9B59B6
}

export default class extends Command<Client> {
    public constructor() {
        super({
            name: 'about',
            aliases: ['info'],
            desc: 'About Blue',
            usage: '<prefix>about',
            group: 'utility',
            guildOnly: true
        });
    }

    public action(message: Message): void {
        const embed: RichEmbed = new RichEmbed()
            .setAuthor('Blue', this.client.user.avatarURL)
            .setColor(EmbedCode.Profile)
            .setDescription(`I master! I'm Blue v${version} ready to serve you!`)
            .addField('Servers', this.client.guilds.size.toString(), true)
            .addField('Channels', this.client.channels.size.toString(), true)
            .addField('Users', this.client.guilds.map((guild: Guild) => guild.memberCount)
                .reduce((memA: number, memB: number) => memA + memB), true)
            .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`, true)
            .addField('Uptime', Time.difference(this.client.uptime * 2, this.client.uptime).toString(), true)
            .addField('Help', `To see currently available commands, type <@${this.client.user.id}> help`, true);
        message.channel.send({ embed });
    }
}

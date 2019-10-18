import { Command, Message, Time } from '@yamdbf/core';
import { RichEmbed, Guild } from 'discord.js';
import { Bot } from '../../bot';

const { version } = require('../../../package');

export default class extends Command<Bot> {
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
      .setColor(this.client.embedCode.Profile)
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

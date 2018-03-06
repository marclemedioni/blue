import { Client, Command, Message, Time } from 'yamdbf';
import { RichEmbed, Guild } from 'discord.js';
import * as cheerio from 'cheerio';
import * as request from 'request';
import * as snekfetch from "snekfetch";

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
      name: 'vdm',
      aliases: ['vdm'],
      desc: 'Quote VDM',
      usage: '<prefix>vdm',
      group: 'vdm',
      guildOnly: false
    });
  }

  public async action(message: Message) {
    const res: snekfetch.Result = await snekfetch.get('http://www.viedemerde.fr/aleatoire').end();
    const body = res.body.toString();

    const $ = cheerio.load(body);
    const vdm = $('p').children().first().text()
    const firstVDMarticle = $('article').first();
    const text = firstVDMarticle.find('.panel-content p a').text();
    const img = firstVDMarticle.find('figure a img').attr('data-src');
    const embed: RichEmbed = new RichEmbed()
      .setColor(EmbedCode.Profile)
      .setDescription(vdm)
      .setThumbnail('http://www.betacie.com/img/logo-vdm.png')
      .setImage(img)
    message.channel.send({ embed });
  }
}

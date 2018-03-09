import { Command, Message, Time } from 'yamdbf';
import { RichEmbed, Guild } from 'discord.js';
import * as cheerio from 'cheerio';
import * as snekfetch from "snekfetch";
import info from '../../structures/constante'
import { Bot } from '../../bot';

export default class extends Command<Bot> {
  public constructor() {
    super({
      name: 'vdm',
      desc: 'Quote VDM',
      usage: '<prefix>vdm',
      group: 'vdm',
      guildOnly: false
    });
  }

  public async action(message: Message) {
    console.log(info)
    const res: snekfetch.Result = await snekfetch.get('http://www.viedemerde.fr/aleatoire').end();
    const body = res.body.toString();
    const $ = cheerio.load(body);
    const firstVDMarticle = $('article').first();
    const text = firstVDMarticle.find('.panel-content p a').text();
    const img = firstVDMarticle.find('figure a img').attr('data-src');
    const embed: RichEmbed = new RichEmbed()
      .setColor(info.COLOR.Info)
      .setThumbnail(info.LOGO.VDM)
      .setImage(img)
    message.channel.send({ embed });
  }
}

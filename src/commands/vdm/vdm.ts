import { Client, Command, Message, Time } from 'yamdbf';
import { RichEmbed, Guild } from 'discord.js';
import * as cheerio from 'cheerio';
import * as request from 'request'

const { version } = require('../../../package');
let html:any
let vdm: any
let $:   any
let $2:  any
let img: string

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


    public action(message: Message) {
        request({
            method: 'GET',
            url: 'http://www.viedemerde.fr/aleatoire'
        }, function(err, response, body) {
            if (err) return console.error(err);
                $ = cheerio.load(body)
                vdm = $('p').children().first().text()
                html =$('figure.visible-xs').first().text().trim()
                $2 = cheerio.load(html)
                img = $2('img').attr('data-src')
                const embed: RichEmbed = new RichEmbed()
                .setColor(EmbedCode.Profile)
                .setDescription(vdm)
                .setThumbnail('http://www.betacie.com/img/logo-vdm.png')
                .setImage(img)
                message.channel.send({ embed });

        });
        
       
            
            

        
        
        
    }
}

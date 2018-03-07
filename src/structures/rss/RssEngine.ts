import { Logger, GuildStorage } from "yamdbf";
import * as cheerio from 'cheerio';
import * as snekfetch from 'snekfetch';
import * as moment from 'moment';
import * as striptags from 'striptags';

import { Bot } from '../../bot';
import { GuildChannel, TextChannel, RichEmbed } from "discord.js";

const RSS_PULL_INTERVAL = 1000 * 60 * 1;

export class RssEngine {
  private client: Bot;
  private readonly logger: Logger = Logger.instance();

  constructor(bot: Bot) {
    this.client = bot;
  }

  public async init() {
    await this._initStorages();
    this._launch();
  }

  private async _initStorages() {
    const guilds = this.client.guilds
    
    await guilds.forEach(async guild => {
      let guildStorage: GuildStorage | undefined = this.client.storage.guilds.get(guild.id);
      if (guildStorage) {
        let rssData = await guildStorage.get('rss');

        if (!rssData) {
          this.logger.info('RssEngine', `Initializing rss data for guild ${guild.id}`);
          await guildStorage.set('rss', {
            lastCheck: new Date(),
            feeds: []
          })
        }
      }
    });
  }

  private _launch() {
    this.logger.info('RssEngine', 'Launching rss engine');
    this._checkFeeds();
    setInterval(this._checkFeeds.bind(this), RSS_PULL_INTERVAL);
  }

  private _checkFeeds() {
    this.logger.info('RssEngine', 'Checking rss feeds');
    const guilds = this.client.guilds
    
    guilds.forEach(async guild => {

      let defaultGuildChannel: any = guild.channels.find((channel: GuildChannel) => {
        return channel.position === 0 && channel.type === 'text' &&  channel.guild.id === guild.id
      });

      let guildStorage: GuildStorage | undefined = this.client.storage.guilds.get(guild.id);
      if (guildStorage) {
        let rssData = await guildStorage.get('rss');
        let feedsToCheck = rssData.feeds;
        let lastCheckDate = moment(rssData.lastCheck);

        feedsToCheck.forEach(async (feed: string) => {
          const res: snekfetch.Result = await snekfetch.get(feed).end();
          const $ = cheerio.load(res.body.toString(), {
            normalizeWhitespace: true,
            xmlMode: true
          });

          const feedTitle = $('channel > title').text();
          const items = $('item');

          items.each((i, item) => {            
            let $item = $(item);
            let title = $item.find('title').text();
            let date = moment(new Date($item.find('pubDate').text()));
            let description = striptags($item.find('description').text());

            if (date.isAfter(moment(lastCheckDate))) {
              const embed: RichEmbed = new RichEmbed()
                .setAuthor(feedTitle)
                .setTitle(title)
                .setDescription(description)
                .setColor(this.client.embedCode.Info)
                
                defaultGuildChannel.send({ embed });
            }
          })
        });
        await guildStorage.set('rss.lastCheck', new Date());
      }
    })
  }
}

import { Command, Message, GuildStorage, Guild } from "yamdbf";
import { using } from "yamdbf/bin/command/CommandDecorators";
import { resolve } from "yamdbf/bin/command/middleware/Resolve";
import * as snekfetch from 'snekfetch';

import { Bot } from "../../bot";

export default class extends Command<Bot> {
  public constructor() {
    super({
      name: 'rss',
      desc: 'Manage RSS',
      usage: '<prefix>rss <command> <value>',
      group: 'rss',
      guildOnly: false
    });
  }

  @using(resolve({ "<command>": "String" }))
  @using(resolve({ "<value>": "String" }))
  @using(function (message: Message, [command, value]: string[]) {
    if (!command) {
      throw `Please use a sub command < add | remove | list >`
    }

    if (['add', 'remove'].indexOf(command) > -1 && !value) {
      throw `Please provide a value for sub command ${command}`
    }

    return [message, [command, value]];
  })
  public async action(message: Message, [command, value]: string[]) {
    let status: Message;
    switch(command) {
      case 'add':
        status = await message.channel.send("Trying to get rss feed...") as Message;
        try {
          await this._addRssFeed(message.guild.id, value);
          status.edit(`:ok_hand: Feed added succesfuly ! I'll occasionally check for it and give you some fresh news !`)
        }
        catch(e) {
          status.edit(`:exclamation: Unable to add rss feed: ${e.message}`)
        }
        break;
      case 'remove':
        break;
      case 'list':
        break;
      default:
      return message.channel.send("Unknown sub command.");
    }
  }

  private async _addRssFeed(guildId: string, feedUrl: string) {
    const res: snekfetch.Result = await snekfetch.get(feedUrl).end();

    let guildStorage: GuildStorage | undefined = this.client.storage.guilds.get(guildId);
    if (guildStorage) {
      let rssFeeds = await guildStorage.get('rss.feeds');

      if (rssFeeds.find((feed: string) => feedUrl === feed)) {
        throw new Error(`${feedUrl} is already checked`)
      }
      
      rssFeeds.push(feedUrl);
      await guildStorage.set('rss.feeds', rssFeeds);
    }

    else {
      throw new Error('Unable to find guild storage')
    }
  }
}

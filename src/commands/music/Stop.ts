import { Command, Message } from "@yamdbf/core";
import { GuildMember } from "discord.js";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from "../../bot";
import { validate } from "../../util/decorators/validate";

export class StopCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "stop",
      aliases: ["stfu"],
      desc: "Stops the current audio playing",
      usage: "<prefix>stop",
      group: "music",
      guildOnly: true
    });
  }

  @validate
  public async action(message: Message): Promise<any> {
    const queue: Queue | undefined = this.client.music.queues.get(
      message.guild.id
    );

    if (!queue) {
      return;
    }

    try {
      queue.videos = [];
      queue!.dispatcher!.end();
      queue.voters = [];
    } catch (err) {
      return message.channel.send("Unable to stop the queue.");
    }
    return message.channel.send(
      `Stopped queue, **${queue.videos.length}** videos have been skipped`
    );
  }
}

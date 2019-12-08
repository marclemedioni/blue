import { Command, Message } from "@yamdbf/core";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from "../../bot";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

export class SkipCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "skip",
      aliases: ["next"],
      desc: "Skips the current audio playing",
      usage: "<prefix>skip",
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

    const video: MusicVideo = queue.videos[0];

    try {
      queue!.dispatcher!.end();
      return message.channel.send(`Skipped: **${video.title}**`);
    } catch (err) {
      return message.channel.send("Unable to skip!");
    }
  }
}

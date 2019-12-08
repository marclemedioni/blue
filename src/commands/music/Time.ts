import { Command, Message } from "@yamdbf/core";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from "../../bot";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

export class TimeCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "time",
      aliases: [],
      desc: "Shows how long audio has been playing for",
      usage: "<prefix>time",
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
    const time: number = Math.round(
      queue!.dispatcher!.time / 1000 + video.start
    );
    const timeLeft: string = MusicVideo.formatDuration(video.duration - time);
    const timeCurrent: string = MusicVideo.formatDuration(time);
    message.channel.send(
      `Current time: **${timeCurrent}**\nTime left: **${timeLeft}**`
    );
  }
}

import {
  Command,
  Message,
  CommandDecorators,
  Middleware,
  MiddlewareFunction
} from "@yamdbf/core";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from "../../bot";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

const { using } = CommandDecorators;
const { resolve, expect } = Middleware;

export class VolumeCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "volume",
      aliases: ["v", "vol"],
      desc: "Changes volume based on input ('|' means or)",
      usage: "<prefix>volume <number|+|-|=|earrape>",
      group: "music",
      guildOnly: true
    });
  }
  // tslint:disable no-shadowed-variable
  @validate
  @using(resolve({ "<number|+|-|=|earrape>": "String" }))
  @using(expect({ "<number|+|-|=|earrape>": "String" }))
  @using(function(this: Command<Bot>, message: Message, [input]: string[]) {
    let queue: Queue | undefined = this.client.music.queues.get(
      message.guild.id
    );

    if (!queue) {
      return [message, []];
    }

    let current: number = queue!.dispatcher!.volume;
    let volume: number = parseInt(input);
    if (isNaN(volume)) {
      if (["+", "up"].includes(input)) {
        volume = current + 1;
      } else if (["-", "down"].includes(input)) {
        volume = current - 1;
      } else if (["=", "pls"].includes(input)) {
        volume = 1;
      }
    }
    if (volume < 1) throw "Volume too low";
    if (volume > 5) throw "Are you fuckin' kidding ?";
    return [message, [volume]];
  })
  public async action(message: Message, [volume]: [number]): Promise<any> {
    const queue: Queue | undefined = this.client.music.queues.get(
      message.guild.id
    );

    if (!queue) {
      return;
    }

    try {
      queue!.dispatcher!.setVolumeLogarithmic(volume / 10);
      queue.volume = queue!.dispatcher!.volume;
    } catch (err) {
      return message.channel.send("Couldn't change the volume.");
    }
  }
}

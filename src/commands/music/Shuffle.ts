import { Command, Message } from "@yamdbf/core";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from '../../bot'
import { validate } from "../../util/decorators/validate";

export class ShuffleCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "shuffle",
      aliases: [],
      desc: "Shuffles the queue",
      usage: "<prefix>shuffle",
      group: "music",
      guildOnly: true
    });
  }

  @validate
  public async action(message: Message): Promise<any> {
    const queue: Queue | undefined = this.client.music.queues.get(message.guild.id);
    if (queue) {
      queue.shuffle();
      message.channel.send("Shuffled the queue.");
    }
  }
}

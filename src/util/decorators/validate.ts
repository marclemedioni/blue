import { Command, Message } from "@yamdbf/core";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from "../../bot";

export function validate(proto: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (key !== "action") throw new Error("Wrong method mate");
  const original: Function = descriptor.value;
  descriptor.value = function (this: Command<Bot>, message: Message, ...args: any[]) {
    const queue: Queue | undefined = this.client.music.queues.get(message.guild.id);
    if (!queue) {
      return message.channel.send("There is no queue.");
    } else if (!queue.connection) {
      return message.channel.send("I am not in a voice channel.");
    } else if (!queue.dispatcher) {
      return message.channel.send("I am not playing anything.");
    } else if (!queue.voice.members.has(message.author.id)) {
      return message.channel.send("You are not in my voice channel");
    } else {
      return original.apply(this, [message, ...args]);
    }
  };
  return descriptor;
}

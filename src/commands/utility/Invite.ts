import { Command, Message } from "@yamdbf/core";
import { Bot } from '../../bot'

export class InviteCommand extends Command<Bot> {
  public constructor() {
    super({
      name: "invite",
      aliases: ["i", "inv"],
      desc: "Generates an invite for the bot",
      usage: "<prefix>invite",
      group: "utility"
    });
  }

  public async action(message: Message): Promise<any> {
    try {
      const invite = await this.client.generateInvite([
        "READ_MESSAGES",
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "USE_EXTERNAL_EMOJIS",
        "ADD_REACTIONS",
        "CONNECT",
        "SPEAK",
        "USE_VAD"
      ]);
      message.channel.send(`Here is my invite:\n${invite}`);
    } catch (err) {
      message.channel.send("Can't generate an invite for some reason.");
    }
  }
}

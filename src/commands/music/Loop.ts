import { Client, Command, Message } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { Bot } from '../../bot'
import { validate } from "../../util/decorators/validate";

export class LoopCommand extends Command<Bot> {
	public constructor() {
		super({
			name: "loop",
			aliases: ["toggle-repeat", "toggle-loop", "repeat"],
			desc: "Loops the audio that is playing",
			usage: "<prefix>loop",
			group: "music",
			guildOnly: true
		});
	}

	@validate
	public async action(message: Message): Promise<any> {
    const queue: Queue | undefined = this.client.music.queues.get(message.guild.id);

    if (!queue) {
      return;
    }

		if (queue.loop) {
			message.channel.send("No longer looping.");
		} else {
			message.channel.send("Now looping audio.");
		}
		queue.loop = !queue.loop;
	}
}

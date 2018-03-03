import * as path from 'path';
import { Client, LogLevel, Logger, ListenerUtil } from 'yamdbf';

import { MusicPlayer } from "./structures/music/MusicPlayer";

const { once } = ListenerUtil;
const { DISCORD_TOKEN } = process.env;

let keys: any = {};
try {
	keys = require("../keys.json");
} catch (err) {
	keys = {};
}

export class Bot extends Client {

  private readonly logger: Logger = Logger.instance();
  public readonly music: MusicPlayer;
	public readonly keys: any;

  public constructor() {
    super({
      token: DISCORD_TOKEN,
      unknownCommandError: true,
      statusText: 'Optimal.',
      readyText: 'Ready.',
      commandsDir: path.resolve(__dirname, 'commands'),
      passive: false,
      ratelimit: '100/1m',
      logLevel: LogLevel.DEBUG,
      pause: true,
      disableBase: [
				"setlang",
				"disablegroup",
				"enablegroup",
				"ping",
				"listgroups",
				"reload"
			]
    });

    this.keys = {
      google: process.env.GOOGLE_API_KEY || keys.GOOGLE
		};
    this.music = new MusicPlayer(this);
  }

  @once('pause')
  private async _onPause() {
    await this.setDefaultSetting('prefix', '!');
    this.emit('continue');
  }
}

import * as path from 'path';
import { Client, LogLevel, Logger, ListenerUtil } from '@yamdbf/core';

import { MusicPlayer } from "./structures/music/MusicPlayer";

const { once } = ListenerUtil;
const { DISCORD_TOKEN } = process.env;

enum embedCode {
  'Default' = 0x000000,
  'Error' = 0xE74C3C,
  'Warn' = 0xE67E22,
  'Info' = 0x007EFF,
  'Profile' = 0x9B59B6
};

export class Bot extends Client {

  private readonly logger: Logger = Logger.instance();
  public readonly music: MusicPlayer;
  public readonly keys: any;
  public readonly embedCode = embedCode;

  public constructor() {
    super({
      owner: ['232940788785348609', '138403669170323456'],
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
      google: process.env.GOOGLE_API_KEY
    };
    this.music = new MusicPlayer(this);
    this.embedCode = embedCode;
  }

  @once('pause')
  private async _onPause() {
    await this.setDefaultSetting('prefix', '!');
    this.emit('continue');
  }
}

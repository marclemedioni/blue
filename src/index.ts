import './config/dotenv';
import { log } from "./log";
import { Bot } from "./bot";

const bot = new Bot();

bot.start();
bot.on('disconnect', (): void => process.exit(0));
(process as NodeJS.EventEmitter).on('unhandledRejection', (reason: string): void => {
  console.error(reason);
});

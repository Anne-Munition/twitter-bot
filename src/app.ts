// import * as database from './database';
import logger from './logger';
import * as database from './database';
import * as twitter from './twitter';

async function start(): Promise<void> {
  await database.connect();
  await twitter.init();
  await twitter.connect();
}

async function stop(): Promise<void> {
  const shutdownSequence = [twitter.disconnect, database.disconnect];

  for (let i = 0; i < shutdownSequence.length; i++) {
    try {
      await shutdownSequence[i]();
    } catch (e) {
      logger.error(e);
    }
  }
}

export default {
  start,
  stop,
};

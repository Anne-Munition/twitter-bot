import {
  ETwitterStreamEvent,
  TweetStream,
  TweetV2SingleStreamResult,
  TwitterApi,
} from 'twitter-api-v2';
import tweetHandler from './tweetHandler';
import logger from '../logger';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

let stream: TweetStream<TweetV2SingleStreamResult>;

export async function init() {
  // Delete old rules
  const rules = await client.v2.streamRules();
  if (rules.data?.length) {
    await client.v2.updateStreamRules({
      delete: { ids: rules.data.map((rule) => rule.id) },
    });
  }

  // Add new rules
  await client.v2.updateStreamRules({
    add: [{ value: `from:${process.env.TWITTER_USER}` }],
  });
}

export async function connect() {
  stream = await client.v2.searchStream({
    // backfill_minutes: minutes.toString(),
    'tweet.fields': ['in_reply_to_user_id', 'entities'],
  });
  // Enable auto reconnect
  stream.autoReconnect = true;
  stream.autoReconnectRetries = Infinity;

  stream.on(ETwitterStreamEvent.Connected, () => {
    logger.info(`Connected to Twitter stream: ${process.env.TWITTER_USER}`);
  });

  stream.on(ETwitterStreamEvent.Data, ({ data }) => {
    tweetHandler(data);
  });

  stream.on(ETwitterStreamEvent.ConnectionError, (err) => {
    logger.error(`Twitter connection error: ${err.message}`);
  });

  stream.on(ETwitterStreamEvent.ConnectionClosed, () => {
    logger.warn('Twitter stream connection has been closed.');
  });
}

export async function disconnect() {
  stream?.destroy();
}

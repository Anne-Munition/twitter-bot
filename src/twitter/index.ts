import {
  ETwitterStreamEvent,
  TweetStream,
  TweetV2SingleStreamResult,
  TwitterApi,
} from 'twitter-api-v2';
import tweetHandler from './tweetHandler';
import logger from '../logger';

if (!process.env.TWITTER_BEARER_TOKEN) throw new Error('Missing TWITTER_BEARER_TOKEN');
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

let stream: TweetStream<TweetV2SingleStreamResult>;
let username: string;
let id: string;

export async function init() {
  await client.v2
    .userByUsername((process.env.TWITTER_USERNAME as string).toLowerCase())
    .then(({ data }) => {
      username = data.username;
      id = data.id;
    });

  const rules = await client.v2.streamRules();
  if (rules.data?.length) {
    await client.v2.updateStreamRules({
      delete: { ids: rules.data.map((rule) => rule.id) },
    });
  }

  await client.v2.updateStreamRules({
    add: [{ value: `from:${username}` }],
  });
}

export function getUsername(): string {
  return username;
}

export function getId(): string {
  return id;
}

let initReconnects = 0;
export async function connect() {
  try {
    stream = await client.v2.searchStream({
      'tweet.fields': ['in_reply_to_user_id', 'entities'],
    });
    logger.info(`Connected to Twitter stream: ${username}`);
  } catch (err) {
    logger.warn(`Error with initial connection to Twitter stream: ${username}`);
    initReconnects++;
    if (initReconnects === 20) return;
    setTimeout(connect, initReconnects * 5000);
    return;
  }

  stream.autoReconnect = true;
  stream.autoReconnectRetries = Infinity;

  stream.on(ETwitterStreamEvent.Data, ({ data }) => {
    tweetHandler(data);
  });

  stream.on(ETwitterStreamEvent.Connected, () => {
    logger.info(`Connected to Twitter stream: ${username}`);
  });

  stream.on(ETwitterStreamEvent.ConnectionError, (err) => {
    logger.error(`Twitter connection error: ${err.message}`);
  });

  stream.on(ETwitterStreamEvent.ConnectionClosed, () => {
    logger.warn('Twitter stream connection has been closed.');
  });
}

export async function disconnect() {
  stream?.close();
}

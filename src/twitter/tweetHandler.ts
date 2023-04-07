import logger from '../logger';
import { TweetV2 } from 'twitter-api-v2';
import * as discord from '../discord';
import { getUsername, getId } from './index';
import * as twitch from '../twitch';

const oldTweetIds: string[] = [];
if (!process.env.TWITCH_USERNAME) throw new Error('Missing TWITCH_USERNAME');

export default async function tweetHandler(tweet: TweetV2) {
  const username = getUsername();
  const id = getId();
  const link = `https://twitter.com/${username}/status/${tweet.id}`;
  logger.info(`Processing Tweet: ${link}`);
  logger.debug(JSON.stringify(tweet, null, 2));

  if (tweet.in_reply_to_user_id && tweet.in_reply_to_user_id !== id) return;
  if (oldTweetIds.includes(tweet.id)) return;
  oldTweetIds.push(tweet.id);
  if (oldTweetIds.length >= 10) oldTweetIds.shift();

  discord.sendMessage(tweet.id, link).catch(() => {});
  twitch.sendMessage(tweet, link).catch(() => {});
}

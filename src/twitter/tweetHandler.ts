import logger from '../logger';
import { TweetV2 } from 'twitter-api-v2';
import { decode } from 'html-entities';
import { announce } from '../streamelements';

const oldTweetIds: string[] = [];
const name = process.env.TWITTER_USER;
export const goingLiveUrl = new RegExp(`https?:\/\/twitch.tv\/${name}`, 'i');

export default async function tweetHandler(data: TweetV2) {
  logger.info(`Processing Tweet: ${data.id}`);
  logger.debug(JSON.stringify(data, null, 2));

  if (data.in_reply_to_user_id) return;
  if (oldTweetIds.includes(data.id)) return;
  oldTweetIds.push(data.id);
  if (oldTweetIds.length >= 10) oldTweetIds.shift();

  const urls = data.entities?.urls?.map((x) => x.url) || [];
  const expandedUrls = data.entities?.urls?.map((x) => x.expanded_url) || [];

  const isGoingLiveTweet = expandedUrls.find((x) => goingLiveUrl.test(x));
  const [stream] = await twitchApi.getStreams([name]);
  if (!stream && !isGoingLiveTweet) return;

  let text = decode(data.text);
  urls.forEach((x) => {
    text = text.replace(x, '');
  });
  text = text.replace(/\n+/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/^"|"$/g, '');
  text = text.trim();

  const link = `https://twitter.com/${name}/status/${data.id}`;

  const message = text
    ? `New tweet from ${name}: "${text}" ${link}`
    : `New tweet from ${name}: ${link}`;

  await announce(message);
}

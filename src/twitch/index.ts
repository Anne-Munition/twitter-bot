import { initToken } from './twitch_axios';
import endpoints from './endpoints';
import { decode } from 'html-entities';
import { announce } from '../streamelements';
import { TweetV2 } from 'twitter-api-v2';
import { getUsername } from '../twitter';

export async function init() {
  await initToken();
}

export async function sendMessage(tweet: TweetV2, link: string) {
  const live = await isLive();
  if (!live) return;

  const username = getUsername();
  const urls = tweet.entities?.urls?.map((x) => x.url) || [];

  let text = decode(tweet.text);
  urls.forEach((x) => {
    text = text.replace(x, '');
  });
  text = text.replace(/\n+/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/^"|"$/g, '');
  text = text.trim();

  const message = text
    ? `New tweet from ${username}: "${text}" ${link}`
    : `New tweet from ${username}: ${link}`;

  announce(message).catch(() => {});
}

async function isLive(tries = 1): Promise<boolean> {
  return new Promise(async (resolve) => {
    const [stream] = await endpoints.getStreams([process.env.TWITCH_USERNAME as string]);
    if (stream) {
      resolve(true);
      return;
    } else {
      if (tries >= 5) {
        resolve(false);
        return;
      }
      setTimeout(() => {
        isLive(tries++);
      }, 1000 * 60);
    }
  });
}

import { initToken } from './twitch_axios';
import endpoints from './endpoints';
import { decode } from 'html-entities';
import { announce } from '../streamelements';
import { TweetV2 } from 'twitter-api-v2';
import { getUsername } from '../twitter';

if (!process.env.TWITCH_USERNAME) throw new Error('Missing TWITCH_USERNAME');

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

export function isLive(): Promise<boolean> {
  return new Promise((resolve) => {
    (async function check(tries: number) {
      const [stream] = await endpoints.getStreams([process.env.TWITCH_USERNAME as string]);
      if (stream) {
        resolve(true);
        return;
      } else {
        if (tries >= 5) {
          resolve(false);
          return;
        }
        await timeout();
        check((tries += 1));
      }
    })(1);
  });
}

export function timeout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * 60);
  });
}

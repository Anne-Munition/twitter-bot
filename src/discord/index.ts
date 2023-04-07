import axios from 'axios';
import TweetService from '../database/tweets';
import { TweetChannels } from '../database/tweets/tweet_model';

if (!process.env.DISCORD_BOT_TOKEN) throw new Error('Missing DISCORD_BOT_TOKEN');

const client = axios.create({
  baseURL: 'https://discord.com/api',
  headers: {
    Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
  },
});

const channels = ['362349719663542272', '92313043303665664'];

export async function sendMessage(tweetId: string, text: string) {
  const requests = channels.map((channel) => {
    return client
      .post(`/channels/${channel}/messages`, { content: text })
      .then(({ data }) => data)
      .catch(() => {
        return null;
      });
  });
  const messageIds: TweetChannels = [];
  Promise.all(requests).then((responses: MessageSentResponse[]) => {
    responses.forEach((response) => {
      if (!response) return;
      messageIds.push({ channelId: response.channel_id, messageId: response.id });
    });
    TweetService.addTweet(tweetId, messageIds);
  });
}

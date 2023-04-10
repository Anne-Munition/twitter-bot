process.env.DISCORD_BOT_TOKEN = 'bot_token';
process.env.TWITTER_BEARER_TOKEN = 'bearer_token';
process.env.TWITCH_USERNAME = 'twitch_username';

import tweetHandler from '../tweetHandler';
import * as twitch from '../../twitch';
import * as discord from '../../discord';
import * as twitter from '../index';
import { TweetV2 } from 'twitter-api-v2';

jest.mock('../../twitch');
jest.mock('../../discord');
jest.mock('../../logger');

jest.spyOn(twitter, 'getUsername').mockImplementation(() => {
  return 'AnneMunition';
});

function getTweet(): TweetV2 {
  return {
    id: Math.floor(Math.random() * 100000000000).toString(),
    text: '',
    edit_history_tweet_ids: [],
  };
}

describe('tweetHandler', () => {
  let tweet: TweetV2;
  beforeEach(() => {
    jest.clearAllMocks();
    tweet = getTweet();
  });

  it('sends tweet to handlers', async () => {
    await tweetHandler(tweet);
    expect(discord.sendMessage).toHaveBeenCalled();
    expect(twitch.sendMessage).toHaveBeenCalled();
  });

  it('does not send if there is an in_reply_to_user_id present', async () => {
    tweet.in_reply_to_user_id = '1234';
    await tweetHandler(tweet);

    expect(discord.sendMessage).not.toHaveBeenCalled();
    expect(twitch.sendMessage).not.toHaveBeenCalled();
  });

  it('does not send if duplicate tweet', async () => {
    await tweetHandler(tweet);
    await tweetHandler(tweet);

    expect(discord.sendMessage).toHaveBeenCalledTimes(1);
    expect(twitch.sendMessage).toHaveBeenCalledTimes(1);
  });
});

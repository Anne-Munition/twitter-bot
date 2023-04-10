/*process.env.DISCORD_BOT_TOKEN = 'bot_token';

import * as discord from '../index';
import nock from 'nock';
import TweetService from '../../database/tweets';
import axios from 'axios';

jest.mock('../../database/tweets');
jest.mock('axios');

axios.create.mockImplementation((config) => axios);

describe('discord tweet handler', () => {
  it('posts to discord for each channel specified', () => {
    const spy = nock('https://discord.com/api')
      .post('/channels/362349719663542272/messages')
      .reply(204);
    // discord.sendMessage('some_id', 'some_text');
    expect(spy).toHaveBeenCalled();
  });
});*/

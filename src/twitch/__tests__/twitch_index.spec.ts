process.env.DISCORD_BOT_TOKEN = 'DISCORD_BOT_TOKEN';
process.env.TWITTER_BEARER_TOKEN = 'TWITTER_BEARER_TOKEN';
process.env.TWITCH_USERNAME = 'TWITCH_USERNAME';

import * as index from '../index';
import endpoints from '../endpoints';
import * as fixtures from '../__fixtures__/stream';

describe('twitch index module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('isLiveMulti method', () => {
    it('returns true if the stream is live', async () => {
      jest.spyOn(endpoints, 'getStreams').mockResolvedValueOnce([fixtures.stream]);

      const live = await index.isLive();
      expect(live).toBe(true);
    });

    it('returns false if the stream is not live after 5 attempts', async () => {
      const spy = jest
        .spyOn(endpoints, 'getStreams')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const live = await index.isLive();

      expect(spy).toHaveBeenCalledTimes(5);
      expect(live).toBe(false);
    });

    it('returns true if the stream is live within 5 attempts', async () => {
      const spy = jest
        .spyOn(endpoints, 'getStreams')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([fixtures.stream])
        .mockResolvedValueOnce([]);

      const live = await index.isLive();

      expect(spy).toHaveBeenCalledTimes(5);
      expect(live).toBe(true);
    });

    it('returns true if the stream is live within 3 attempts', async () => {
      const spy = jest
        .spyOn(endpoints, 'getStreams')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([fixtures.stream])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const live = await index.isLive();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(live).toBe(true);
    });
  });
});

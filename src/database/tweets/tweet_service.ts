import Tweet, { TweetChannels } from './tweet_model';

export function addTweet(tweetId: string, channels: TweetChannels) {
  const doc = new Tweet({
    tweet_id: tweetId,
    channels,
  });
  doc.save().catch(() => {});
}

export function deleteTweet(tweetId: string) {
  Tweet.findOne({ tweet_id: tweetId }).then((doc) => {
    if (!doc) return;
    // Delete Discord Channels
    doc.deleteOne();
  });
}

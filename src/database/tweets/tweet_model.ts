import { Schema, Document, model } from 'mongoose';

const schema = new Schema({
  tweet_id: String,
  channels: Array,
});

export interface TweetDoc extends Document {
  tweet_id: string;
  channels: TweetChannels;
}

export type TweetChannels = { channelId: string; messageId: string }[];

export default model<TweetDoc>('tweets', schema);

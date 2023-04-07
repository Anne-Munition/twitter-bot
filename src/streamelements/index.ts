import axios, { AxiosResponse } from 'axios';
import logger from '../logger';

let channelId: string;

function headers() {
  return {
    authorization: `Bearer ${process.env.STREAMELEMENTS_JWT}`,
  };
}

export async function init(): Promise<void> {
  const url = 'https://api.streamelements.com/kappa/v2/channels/me';
  const options = { headers: headers() };
  const { _id, displayName } = await axios.get(url, options).then(({ data }) => data);
  channelId = _id;
  logger.info(`Streamelements ready. Channel: ${displayName}`);
}

async function say(message: string): Promise<AxiosResponse<any>> {
  const url = `https://api.streamelements.com/kappa/v2/bot/${channelId}/say`;
  const options = { headers: headers() };
  const body = { message };
  return axios.post(url, body, options);
}

export async function announce(message: string): Promise<void> {
  await say(`/announce ${message}`);
}

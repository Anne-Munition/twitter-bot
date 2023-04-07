import axios from 'axios';
import logger from '../logger';

const client = axios.create({ baseURL: 'https://api.twitch.tv/helix' });
let token: string;

client.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${getToken()}`;
    config.headers['Client-ID'] = process.env.TWITCH_CLIENT_ID;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { access_token } = await getAppToken();
      if (!access_token) return Promise.reject(error);
      token = access_token;
      logger.info('Twitch App Token refreshed.');
      originalRequest.headers.authorization = 'Bearer ' + access_token;
      return client(originalRequest);
    }
    return Promise.reject(error);
  },
);

function getToken() {
  return token;
}

export async function initToken() {
  const { access_token } = await getAppToken();
  token = access_token;
  logger.info('Twitch App Token retrieved.');
}

async function getAppToken(): Promise<AppToken> {
  return axios
    .post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })
    .then(({ data }) => data);
}

export default client;

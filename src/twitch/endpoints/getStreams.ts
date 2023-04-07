import axios from '../twitch_axios';

export default function getStreams(identities: string[]): Promise<HelixStream[]> {
  const query = identities
    .map((x) => {
      const type = /^\d+$/.test(x) ? 'user_id' : 'user_login';
      return `${type}=${encodeURIComponent(x)}`;
    })
    .join('&');
  const url = `/streams?${query}`;
  return axios.get(url).then(({ data }) => data.data);
}

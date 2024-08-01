import axios from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

const getAccessToken = async () => {
  const clientId = 'b49b633eec39437fb55464bc022b44bd';
  const clientSecret = '31b397dd8e78484f9d342fe1436b418b';
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    }
  );
  return response.data.access_token;
};

export const getSongPreviewUrl = async (songId: string) => {
  const token = await getAccessToken();
  const response = await axios.get(`${SPOTIFY_API_BASE_URL}/tracks/${songId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.preview_url;
};

import axios from 'axios';

const clientId = 'b49b633eec39437fb55464bc022b44bd';
const clientSecret = '31b397dd8e78484f9d342fe1436b418b';
let accessToken: string = '';

export const getSpotifyAccessToken = async (): Promise<string> => {
  if (accessToken) {
    return accessToken;
  }

  const authResponse = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
    grant_type: 'client_credentials'
  }), {
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  accessToken = authResponse.data.access_token;
  return accessToken;
};

// Добавьте эту функцию для получения accessToken
const getValidAccessToken = async (): Promise<string> => {
  if (!accessToken) {
    accessToken = await getSpotifyAccessToken();
  }
  return accessToken;
};

export const fetchSpotifyData = async (endpoint: string): Promise<any> => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error('Failed to get Spotify access token');
  }
  const response = await axios.get(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

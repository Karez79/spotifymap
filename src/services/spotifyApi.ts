// spotifyApi.ts
import axios from 'axios';

const clientId = 'b49b633eec39437fb55464bc022b44bd';
const clientSecret = '31b397dd8e78484f9d342fe1436b418b';

const getAccessToken = async (): Promise<string | null> => {
  const authString = `${clientId}:${clientSecret}`;
  const authBase64 = Buffer.from(authString).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authBase64}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get access token', error);
    return null;
  }
};

export const getSongPreviewUrl = async (songId: string): Promise<string | null> => {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const previewUrl = response.data.preview_url;
    if (!previewUrl) {
      console.error(`No preview URL found for song ID: ${songId}`);
      return null;
    }

    return previewUrl;
  } catch (error) {
    console.error(`Failed to fetch preview URL for song ID: ${songId}`, error);
    return null;
  }
};

export const getFilteredSongs = async (songs: any[]): Promise<any[]> => {
  const filteredSongs: any[] = [];

  for (const song of songs) {
    const previewUrl = await getSongPreviewUrl(song.spotifyId);
    if (previewUrl) {
      filteredSongs.push({
        ...song,
        previewUrl,
      });
    }
  }

  return filteredSongs;
};

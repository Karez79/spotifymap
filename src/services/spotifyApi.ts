import axios from 'axios';
import { getSpotifyAccessToken } from './spotifyAuth';

export const getSongPreviewUrl = async (songId: string): Promise<string | null> => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.preview_url;
  } catch (error) {
    console.error('Failed to fetch preview URL', error);
    return null;
  }
};

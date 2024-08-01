import axios from 'axios';
import { getSpotifyAccessToken } from './spotifyAuth';

export const fetchSongPreviewUrl = async (trackId: string) => {
  const token = await getSpotifyAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.preview_url;
};

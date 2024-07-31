import axios from 'axios';

const API_URL = 'https://api.spotify.com/v1/tracks';

export const getSongPreviewUrl = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.preview_url;
};

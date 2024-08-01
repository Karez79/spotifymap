import axios from 'axios';

const clientId = 'b49b633eec39437fb55464bc022b44bd';
const clientSecret = '31b397dd8e78484f9d342fe1436b418b';

export const getSpotifyAccessToken = async () => {
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  };

  const response = await axios(authOptions);
  return response.data.access_token;
};

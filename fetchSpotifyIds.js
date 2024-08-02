import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientId = 'b49b633eec39437fb55464bc022b44bd';
const clientSecret = '31b397dd8e78484f9d342fe1436b418b';
let accessToken = '';

const getSpotifyAccessToken = async () => {
  const authResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    }
  );
  accessToken = authResponse.data.access_token;
};

const fetchSpotifyData = async (songName, artistName) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/search`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: `track:${songName} artist:${artistName}`,
        type: 'track',
        limit: 1,
      },
    }
  );

  const tracks = response.data.tracks.items;
  if (tracks.length > 0) {
    const track = tracks[0];
    return {
      id: track.id,
      previewUrl: track.preview_url || 'нет'
    };
  } else {
    return null;
  }
};

const updateSongsWithSpotifyData = async (songs) => {
  await getSpotifyAccessToken();

  for (const song of songs) {
    const spotifyData = await fetchSpotifyData(song.name, song.artists);
    song.spotifyId = spotifyData ? spotifyData.id : 'Not found';
    song.previewUrl = spotifyData ? spotifyData.previewUrl : 'нет';
    console.log(`Fetched Spotify data for ${song.name}: ${song.spotifyId}, ${song.previewUrl}`);
  }

  return songs;
};

const main = async () => {
  const songsFilePath = path.join(__dirname, 'src', 'data', 'songs.json');
  const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));

  const updatedSongs = await updateSongsWithSpotifyData(songs);

  fs.writeFileSync(songsFilePath, JSON.stringify(updatedSongs, null, 2));
  console.log('Updated songs.json with Spotify data.');
};

main().catch(console.error);

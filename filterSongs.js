import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filterSongsWithoutPreviewUrl = (songs) => {
  return songs.filter(song => song.previewUrl && song.previewUrl !== 'нет');
};

const main = async () => {
  const songsFilePath = path.join(__dirname, 'src', 'data', 'songs.json');
  const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));

  const filteredSongs = filterSongsWithoutPreviewUrl(songs);

  fs.writeFileSync(songsFilePath, JSON.stringify(filteredSongs, null, 2));
  console.log('Updated songs.json by removing songs without previewUrl.');
};

main().catch(console.error);

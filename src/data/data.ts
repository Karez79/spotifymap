import songsData from './songs.json';
import { Song } from '../types/types';

export const fetchSongs = async (): Promise<Song[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(songsData);
    }, 1000); // Симуляция задержки для асинхронного вызова
  });
};

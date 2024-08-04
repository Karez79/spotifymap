import { Song } from '../types/types';
import songsData from './songs.json';

export const fetchSongs = async (): Promise<Song[]> => {
  return new Promise((resolve) => {
    const songs = songsData.map((data: any, index: number) => ({
      ...data,
      id: index + 1
    }));
    resolve(songs);
  });
};

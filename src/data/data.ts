import Papa from 'papaparse';
import { Song } from '../types/types';
import csvData from './Most Streamed Spotify Songs 2024.csv?raw';

export const fetchSongs = (): Promise<Song[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        console.log(results.data); // Логируем данные для проверки
        const songs: Song[] = results.data.map((song: any, index: number) => ({
          name: song.name,
          artists: song.artists,
          streams: parseInt(song.streams, 10),
          features: [
            Math.random(), // Пример значений фичей
            Math.random(),
            Math.random()
          ],
          id: index + 1,
        }));
        resolve(songs);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

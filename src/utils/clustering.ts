import { Song } from '../types/types';

export const clusterSongs = async (songs: Song[], k: number) => {
  const kmeans = await import('ml-kmeans');
  const data = songs.map(song => song.features);
  return kmeans.default(data, k, { initialization: 'kmeans++' });
};

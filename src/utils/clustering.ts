import { Song } from '../types/types';
import KMeans from 'kmeans-js';

export const clusterSongs = (songs: Song[], k: number) => {
  const data = songs.map(song => song.features);
  const kmeans = new KMeans();
  return kmeans.clusterize(data, { k });
};

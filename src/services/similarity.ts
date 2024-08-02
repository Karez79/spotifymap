import { Song } from '../types/types';
import kmeans from 'ml-kmeans';

const numClusters = 10; // Количество кластеров

let clusteredSongs: Song[][] = [];
let songClusters: number[] = [];

export const clusterSongs = (songs: Song[]): void => {
  const features = songs.map(song => song.features);
  const clusters = kmeans(features, numClusters);

  clusteredSongs = Array.from({ length: numClusters }, () => []);
  songClusters = clusters.clusters;

  songs.forEach((song, index) => {
    clusteredSongs[songClusters[index]].push(song);
  });

  console.log('Clustered Songs:', clusteredSongs);
};

export const findSimilarSongs = (selectedSong: Song, allSongs: Song[]): Song[] => {
  const similarSongs: Song[] = [];
  const threshold = 0.8;
  const clusterIndex = songClusters[selectedSong.id];

  for (const song of clusteredSongs[clusterIndex]) {
    if (song.id !== selectedSong.id) {
      const similarity = calculateCosineSimilarity(selectedSong.features, song.features);
      if (similarity > threshold) {
        similarSongs.push(song);
      }
    }
  }

  return similarSongs;
};

const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

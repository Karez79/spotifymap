import { Song } from '../types/types';

export const findSimilarSongs = (songs: Song[]): [Song, Song][] => {
  const similarPairs: [Song, Song][] = [];
  const threshold = 0.8;

  for (let i = 0; i < songs.length; i++) {
    for (let j = i + 1; j < songs.length; j++) {
      const similarity = calculateCosineSimilarity(songs[i].features, songs[j].features);
      if (similarity > threshold) {
        similarPairs.push([songs[i], songs[j]]);
      }
    }
  }

  return similarPairs;
};

const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

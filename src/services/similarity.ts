import { Song } from '../types/types';

export const findSimilarSongs = (selectedSong: Song, allSongs: Song[]): [Song, Song][] => {
  const similarSongs: [Song, Song][] = [];
  const threshold = 0.8;

  for (const song of allSongs) {
    if (song.id !== selectedSong.id) {
      const similarity = calculateCosineSimilarity(selectedSong.features, song.features);
      if (similarity > threshold) {
        similarSongs.push([selectedSong, song]);
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

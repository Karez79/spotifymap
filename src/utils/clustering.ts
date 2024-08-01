import { Song } from '../types/types';

export const clusterSongs = (songs: Song[], k: number) => {
  const data = songs.map(song => song.features);
  const clusters: number[][] = Array(k).fill(0).map(() => []);
  const centroids: number[][] = Array(k).fill(0).map(() => Array(data[0].length).fill(0));

  // Initialize centroids randomly
  for (let i = 0; i < k; i++) {
    centroids[i] = data[Math.floor(Math.random() * data.length)];
  }

  let changed = true;
  while (changed) {
    // Assign points to the nearest centroid
    data.forEach((point, index) => {
      let minDist = Infinity;
      let clusterIndex = 0;
      centroids.forEach((centroid, i) => {
        const dist = euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });
      clusters[clusterIndex].push(index);
    });

    // Update centroids
    changed = false;
    centroids.forEach((centroid, i) => {
      const newCentroid = Array(centroid.length).fill(0);
      clusters[i].forEach(pointIndex => {
        data[pointIndex].forEach((value, j) => {
          newCentroid[j] += value;
        });
      });
      newCentroid.forEach((sum, j) => {
        newCentroid[j] = sum / clusters[i].length;
        if (newCentroid[j] !== centroid[j]) changed = true;
      });
      centroids[i] = newCentroid;
    });
  }

  const clusterLabels = clusters.flat().map((_, i) => i);
  return { clusters: clusterLabels, centroids };
};

const euclideanDistance = (a: number[], b: number[]): number => {
  return Math.sqrt(a.reduce((sum, value, i) => sum + Math.pow(value - b[i], 2), 0));
};

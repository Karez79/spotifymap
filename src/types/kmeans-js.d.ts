declare module 'kmeans-js' {
    export default class KMeans {
      clusterize(data: number[][], options: { k: number }): { clusters: number[]; centroids: number[][] };
    }
  }
  
declare module 'ml-kmeans' {
    interface KMeansResult {
      clusters: number[];
      centroids: any[];
      converged: boolean;
      iterations: number;
      distance: (x: number[], y: number[]) => number;
    }
  
    interface KMeansOptions {
      initialization?: 'kmeans++' | 'random' | number[];
      maxIterations?: number;
      tolerance?: number;
      distanceFunction?: (x: number[], y: number[]) => number;
    }
  
    function kmeans(
      data: number[][],
      k: number,
      options?: KMeansOptions
    ): KMeansResult;
  
    export = kmeans;
  }
  
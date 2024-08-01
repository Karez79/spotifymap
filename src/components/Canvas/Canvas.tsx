import React, { useRef, useEffect } from 'react';
import { Song } from '../../types/types';
import { clusterSongs } from '../../utils/clustering';
import styles from './Canvas.module.css';

interface CanvasProps {
  songs: Song[];
}

const Canvas: React.FC<CanvasProps> = ({ songs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const draw = async () => {
      if (canvasRef.current && songs.length > 0) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Clustering songs
        const k = 5;
        try {
          const { clusters, centroids } = clusterSongs(songs, k);

          // Log to check clusters and centroids
          console.log('Clusters:', clusters);
          console.log('Centroids:', centroids);

          // Draw centroids
          centroids.forEach((centroid, index) => {
            ctx.beginPath();
            ctx.arc(centroid[0] * canvas.width, centroid[1] * canvas.height, 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
          });

          // Draw songs
          clusters.forEach((clusterIndex, index) => {
            const song = songs[index];
            const centroid = centroids[clusterIndex];
            const x = centroid[0] * canvas.width;
            const y = centroid[1] * canvas.height;
            const size = Math.log(song.streams) / 10;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
          });
        } catch (error) {
          console.error('Clustering failed', error);
        }
      }
    };

    draw();
  }, [songs]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Canvas;

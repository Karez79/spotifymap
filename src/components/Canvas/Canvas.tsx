import React, { useEffect, useRef } from 'react';
import { Song } from '../../types/types';
import { clusterSongs } from '../../utils/clustering';
import { showTooltip, hideTooltip } from '../Tooltip/Tooltip';
import { getSongPreviewUrl } from '../../services/api';

interface CanvasProps {
  songs: Song[];
  setSelectedSong: (song: Song | null) => void;
}

export const drawSongs = async (songs: Song[], setSelectedSong: (song: Song | null) => void) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const k = 5; // number of clusters
  const clusters = await clusterSongs(songs, k);
  console.log('Clusters:', clusters);

  if (!clusters || clusters.clusters.length !== songs.length) {
    console.error('Clustering failed or returned unexpected results');
    return;
  }

  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  clusters.clusters.forEach((cluster: number, index: number) => {
    const song = songs[index];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.log(song.streams) / Math.log(10); // size based on streams

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colors[cluster];
    ctx.fill();
    ctx.stroke();

    canvas.addEventListener('mousemove', (event) => {
      if (ctx.isPointInPath(event.offsetX, event.offsetY)) {
        showTooltip(song, event.pageX, event.pageY);
      } else {
        hideTooltip();
      }
    });

    canvas.addEventListener('click', async (event) => {
      if (ctx.isPointInPath(event.offsetX, event.offsetY)) {
        setSelectedSong(song);
        try {
          const previewUrl = await getSongPreviewUrl(song.id.toString());
          if (previewUrl) {
            const audio = new Audio(previewUrl);
            audio.play();
          }
        } catch (error) {
          console.error('Error fetching song preview URL:', error);
        }
      }
    });
  });
};

const Canvas: React.FC<CanvasProps> = ({ songs, setSelectedSong }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (songs.length > 0) {
      drawSongs(songs, setSelectedSong);
    }
  }, [songs, setSelectedSong]);

  return <canvas id="canvas" ref={canvasRef} width="800" height="600"></canvas>;
};

export default Canvas;

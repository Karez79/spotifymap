import React, { useRef, useEffect, useState } from 'react';
import { Song } from '../../types/types';
import { findSimilarSongs } from '../../services/similarity';
import Tooltip from '../Tooltip/Tooltip';
import './Canvas.module.css';

interface CanvasProps {
  songs: Song[];
}

interface Node {
  song: Song;
  x: number;
  y: number;
  size: number;
  originalSize: number;
  color: string;
  animationProgress: number; // 0 to 1 for animation
}

const Canvas: React.FC<CanvasProps> = ({ songs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredSong, setHoveredSong] = useState<Song | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);

  const loadMoreSongs = () => {
    const nextPage = page + 1;
    const newVisibleSongs = songs.slice(0, nextPage * 15);
    setVisibleSongs(newVisibleSongs);
    setPage(nextPage);
  };

  useEffect(() => {
    loadMoreSongs(); // Загружаем первые 15 песен при монтировании компонента
  }, [songs]);

  useEffect(() => {
    const draw = () => {
      if (canvasRef.current && visibleSongs.length > 0) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Найти пары похожих песен
        const similarPairs = findSimilarSongs(visibleSongs[0], visibleSongs); // Убедитесь, что аргументы правильные

        // Сгенерировать узлы
        const generatedNodes: Node[] = visibleSongs.map((song) => {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.log(song.streams) / 10;
          const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Случайный цвет
          return { song, x, y, size, originalSize: size, color, animationProgress: 0 };
        });

        setNodes(generatedNodes);

        // Анимация линий и узлов
        let animationStep = 0;
        const animate = () => {
          animationStep += 2;
          if (animationStep > 100) animationStep = 0;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Нарисовать связи
          similarPairs.forEach(([song1, song2]: [Song, Song]) => {
            const node1 = generatedNodes.find((node) => node.song.id === song1.id);
            const node2 = generatedNodes.find((node) => node.song.id === song2.id);
            if (node1 && node2) {
              ctx.beginPath();
              ctx.moveTo(node1.x, node1.y);
              const dx = (node2.x - node1.x) * (animationStep / 100);
              const dy = (node2.y - node1.y) * (animationStep / 100);
              ctx.lineTo(node1.x + dx, node1.y + dy);
              ctx.strokeStyle = 'lightgray';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });

          // Нарисовать узлы песен
          generatedNodes.forEach((node) => {
            if (node.animationProgress < 1) {
              node.animationProgress += 0.02; // Увеличиваем прогресс анимации
            }

            ctx.beginPath();
            const animatedSize = node.size * node.animationProgress;
            ctx.arc(node.x, node.y, animatedSize, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.closePath();
          });

          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }
    };

    draw();
  }, [visibleSongs]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredNode = nodes.find((node) => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance < node.size;
    });

    if (hoveredNode) {
      setHoveredSong(hoveredNode.song);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      // Увеличиваем узел при наведении
      canvasRef.current.style.cursor = 'pointer';
      hoveredNode.size = hoveredNode.originalSize * 1.5;
    } else {
      setHoveredSong(null);
      canvasRef.current.style.cursor = 'default';
      nodes.forEach((node) => {
        node.size = node.originalSize;
      });
    }

    // Перерисовать узлы
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Нарисовать связи
        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.closePath();
        });
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        className="canvas"
        width={600}
        height={600}
        onMouseMove={handleMouseMove}
      />
      {hoveredSong && (
        <Tooltip
          song={hoveredSong}
          position={tooltipPosition}
        />
      )}
      <button onClick={loadMoreSongs} style={{ position: 'absolute', top: 10, right: 10 }}>
        Load More
      </button>
    </div>
  );
};

export default Canvas;

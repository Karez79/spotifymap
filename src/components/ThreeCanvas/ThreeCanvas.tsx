import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Song } from '../../types/types';
import { findSimilarSongs } from '../../services/similarity';
import './ThreeCanvas.module.css';

interface ThreeCanvasProps {
  songs: Song[];
  setTooltip: (tooltip: { x: number; y: number; song: Song } | null) => void;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ songs, setTooltip }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas ref is null");
      return;
    }

    if (songs.length === 0) {
      console.error("Songs array is empty");
      return;
    }

    console.log("Canvas ref:", canvasRef.current);
    console.log("Songs:", songs);

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    const songNodes: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const positions: { x: number; y: number }[] = [];

    songs.forEach((song, index) => {
      const x = (index % 5) - 2;
      const y = Math.floor(index / 5) - 2;
      positions.push({ x, y });

      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, 0);
      songNodes.push(node);
      scene.add(node);

      node.userData = { song }; // Добавить данные о песне в userData
    });

    const lines: THREE.Line[] = [];
    const similarPairs = findSimilarSongs(songs);

    similarPairs.forEach(([song1, song2]) => {
      const index1 = songs.indexOf(song1);
      const index2 = songs.indexOf(song2);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
      const points = [];
      points.push(new THREE.Vector3(positions[index1].x, positions[index1].y, 0));
      points.push(new THREE.Vector3(positions[index2].x, positions[index2].y, 0));

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      lines.push(line);
      scene.add(line);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(songNodes);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y } = intersect.point;
        setTooltip({
          x: (x + 1) * width / 2,
          y: -(y - 1) * height / 2,
          song: intersect.object.userData.song
        });

        // Увеличиваем узел при наведении
        intersect.object.scale.set(1.5, 1.5, 1.5);
      } else {
        setTooltip(null);
        // Возвращаем узлы к исходному размеру
        songNodes.forEach(node => node.scale.set(1, 1, 1));
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      songNodes.forEach((node) => {
        node.rotation.x += 0.01;
        node.rotation.y += 0.01;
      });

      lines.forEach((line, index) => {
        if (line.material instanceof THREE.LineBasicMaterial) {
          line.material.color.setHSL((Date.now() % 1000) / 1000, 1, 0.5);
        }
        const offset = Math.sin(Date.now() / 500 + index) * 0.5;
        line.position.z = offset;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      while (canvasRef.current?.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [songs]);

  return <div ref={canvasRef} className="threeCanvas" style={{ width: '100%', height: '100%' }} />;
};

export default ThreeCanvas;

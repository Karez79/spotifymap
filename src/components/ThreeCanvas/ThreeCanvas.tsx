import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Song } from '../../types/types';
import { findSimilarSongs } from '../../services/similarity';
import './ThreeCanvas.module.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeCanvasProps {
  songs: Song[];
  setTooltip: (tooltip: { x: number; y: number; song: Song } | null) => void;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ songs, setTooltip }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas ref is null");
      return;
    }

    if (songs.length === 0) {
      console.error("Songs array is empty");
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasRef.current.appendChild(renderer.domElement);

    camera.position.z = 50;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    controls.update();

    const songNodes: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(0.7, 32, 32); // Размер узлов увеличен

    const colors = [0xFFFFFF, 0xADD8E6, 0xFFFFE0, 0xDDA0DD]; // Цвета звездного неба

    const positions: { x: number; y: number; z: number }[] = [];

    songs.forEach((song, index) => {
      const x = Math.random() * 50 - 25;
      const y = Math.random() * 50 - 25;
      const z = Math.random() * 50 - 25;
      positions.push({ x, y, z });

      const material = new THREE.MeshBasicMaterial({ color: colors[index % colors.length] });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, z);
      songNodes.push(node);
      scene.add(node);

      gsap.fromTo(node.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: "power1.inOut" });

      // Добавим эффект мерцания
      gsap.to(node.material, {
        opacity: 0.5,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      node.userData = { song };
    });

    // Добавим звезды на черный фон
    const starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    for (let i = 0; i < 100; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
      scene.add(star);
    }

    const lines: THREE.Line[] = [];
    const similarPairs = findSimilarSongs(songs[0], songs); // Убедитесь, что аргументы правильные

    similarPairs.forEach(([song1, song2]) => {
      const index1 = songs.indexOf(song1);
      const index2 = songs.indexOf(song2);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xE0E1DD, transparent: true, opacity: 0.5 });
      const points = [
        new THREE.Vector3(positions[index1].x, positions[index1].y, positions[index1].z),
        new THREE.Vector3(positions[index2].x, positions[index2].y, positions[index2].z)
      ];

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      lines.push(line);
      scene.add(line);

      gsap.fromTo(line.material, { opacity: 0 }, { opacity: 0.5, duration: 1, ease: "power1.inOut" });
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

        gsap.to(intersect.object.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power1.inOut" });
      } else {
        setTooltip(null);
        songNodes.forEach(node => gsap.to(node.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power1.inOut" }));
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Плавное перемещение карты
    const animateMap = () => {
      gsap.to(camera.position, {
        x: Math.random() * 50 - 25,
        y: Math.random() * 50 - 25,
        duration: 5,
        ease: 'power1.inOut',
        onComplete: animateMap
      });
    };

    animateMap();

    return () => {
      while (canvasRef.current?.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [songs, setTooltip]);

  return (
    <>
      {showHint && (
        <div className="hint">
          Зажмите мышку и перемещайте карту
        </div>
      )}
      <div ref={canvasRef} className="threeCanvas" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </>
  );
};

export default ThreeCanvas;

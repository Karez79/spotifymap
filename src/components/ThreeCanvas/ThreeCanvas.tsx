import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Song } from '../../types/types';
import { findSimilarSongs } from '../../services/similarity';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tooltip from '../Tooltip/Tooltip';

interface ThreeCanvasProps {
  songs: Song[];
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ songs }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [tooltip, setTooltip] = useState<{ song: Song | null, position: { x: number, y: number }, visible: boolean }>({
    song: null,
    position: { x: 0, y: 0 },
    visible: false
  });

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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const songNodes: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(0.3, 32, 32); // Уменьшенный размер узлов

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
      node.scale.setScalar(Math.log(song.streams) / 10); // Уменьшенный размер узла на основе популярности
      songNodes.push(node);
      scene.add(node);

      gsap.fromTo(node.scale, { x: 0, y: 0, z: 0 }, { x: node.scale.x, y: node.scale.y, z: node.scale.z, duration: 1, ease: "power1.inOut" });

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
    const starGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Уменьшенный размер звезд
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    for (let i = 0; i < 100; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
      scene.add(star);
    }

    const lines: THREE.Line[] = [];
    const similarPairs = songs.flatMap(song => findSimilarSongs(song, songs));

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

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(songNodes);

      if (intersects.length > 0) {
        const intersectedNode = intersects[0].object as THREE.Mesh;
        const { song } = intersectedNode.userData;
        setTooltip({ song, position: { x: event.clientX, y: event.clientY }, visible: true });

        gsap.to(intersectedNode.scale, { x: Math.log(song.streams) / 8, y: Math.log(song.streams) / 8, z: Math.log(song.streams) / 8, duration: 0.3 });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    animate();

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

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      while (canvasRef.current?.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
    };
  }, [songs]);

  return (
    <>
      {showHint && (
        <div className="hint">
          Зажмите мышку и перемещайте карту
        </div>
      )}
      <div ref={canvasRef} className="threeCanvas" />
      {tooltip.song && <Tooltip song={tooltip.song} position={tooltip.position} visible={tooltip.visible} />}
    </>
  );
};

export default ThreeCanvas;

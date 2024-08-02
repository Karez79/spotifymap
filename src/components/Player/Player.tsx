import React, { useEffect, useRef, useState } from 'react';
import './Player.module.css';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Song } from '../../types/types';

interface PlayerProps {
  song: Song;
}

const Player: React.FC<PlayerProps> = ({ song }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const barDataArray = new Uint8Array(bufferLength);

    setAudioContext(context);
    setAnalyser(analyserNode);
    setDataArray(barDataArray);

    return () => {
      context.close();
    };
  }, []);

  useEffect(() => {
    const connectAudioContext = async () => {
      if (audioContext && audioRef.current && !sourceNode) {
        try {
          const newSourceNode = audioContext.createMediaElementSource(audioRef.current);
          newSourceNode.connect(analyser!);
          analyser!.connect(audioContext.destination);
          setSourceNode(newSourceNode);
        } catch (error) {
          console.error("Error connecting audio context:", error);
        }
      }
    };
    connectAudioContext();
  }, [audioContext, analyser, sourceNode]);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      if (audioRef.current) {
        try {
          const response = await fetch(song.previewUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          audioRef.current.src = objectUrl;
          await audioRef.current.play();
        } catch (error) {
          console.error("Failed to load or play audio:", error);
        }
      }
    };

    if (audioContext && analyser) {
      loadAndPlayAudio();
    }
  }, [song, audioContext, analyser]);

  return (
    <div className="player-container">
      <audio ref={audioRef} controls />
      <div className="visualizer">
        <Canvas>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {analyser && dataArray && (
            <Bars analyser={analyser} barDataArray={dataArray} />
          )}
        </Canvas>
      </div>
    </div>
  );
};

const Bars: React.FC<{ analyser: AnalyserNode; barDataArray: Uint8Array }> = ({
  analyser,
  barDataArray,
}) => {
  const meshRef = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    analyser.getByteFrequencyData(barDataArray);
    meshRef.current.forEach((mesh, index) => {
      if (mesh) {
        mesh.scale.y = barDataArray[index] / 256;
      }
    });
  });

  return (
    <>
      {Array.from(barDataArray).map((value, index) => (
        <mesh
          key={index}
          ref={(ref) => {
            if (ref) meshRef.current[index] = ref;
          }}
          position={[index - barDataArray.length / 2, 0, 0]}
        >
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color={0xffffff} />
        </mesh>
      ))}
    </>
  );
};

export default Player;

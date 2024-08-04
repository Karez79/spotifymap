import React, { useEffect, useRef, useState } from 'react';
import { Song } from '../../types/types';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import './Player.module.css';
import '../../App.css';

interface PlayerProps {
  song: Song;
  allSongs: Song[];
  onSongClick: (song: Song) => void;
}

const Player: React.FC<PlayerProps> = ({ song, allSongs, onSongClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log('Audio is playing');
          })
          .catch((error) => {
            setIsPlaying(false);
            console.error('Failed to play audio:', error);
          });
      }
    }
    console.log("Current song:", song);
  }, [song]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    const currentIndex = allSongs.findIndex(s => s.id === song.id);
    const nextIndex = (currentIndex + 1) % allSongs.length;
    onSongClick(allSongs[nextIndex]);
  };

  const playPrevious = () => {
    const currentIndex = allSongs.findIndex(s => s.id === song.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    onSongClick(allSongs[prevIndex]);
  };

  return (
    <div className="player player-visible">
      <div className="song-info">
        <h2>Now Playing</h2>
        <p><strong>{song.name}</strong> by {song.artists}</p>
      </div>
      <div className="controls">
        <FaStepBackward onClick={playPrevious} />
        {isPlaying ? <FaPause onClick={togglePlayPause} /> : <FaPlay onClick={togglePlayPause} />}
        <FaStepForward onClick={playNext} />
      </div>
      <audio controls ref={audioRef} className="audio-element">
        <source src={song.previewUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;

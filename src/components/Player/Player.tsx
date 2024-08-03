import React, { useEffect, useRef } from 'react';
import { Song } from '../../types/types';

interface PlayerProps {
  song: Song;
  allSongs: Song[];
  onSongClick: (song: Song) => void;
}

const Player: React.FC<PlayerProps> = ({ song, allSongs, onSongClick }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio is playing');
          })
          .catch((error) => {
            console.error('Failed to play audio:', error);
          });
      }
    }
    console.log("Current song:", song);
  }, [song]);

  return (
    <div className="player">
      <h2>Now Playing</h2>
      <p><strong>{song.name}</strong> by {song.artists}</p>
      <audio controls ref={audioRef}>
        <source src={song.previewUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;

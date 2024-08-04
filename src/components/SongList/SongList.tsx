import React from 'react';
import { Song } from '../../types/types';
import './SongList.module.css';
import '../../App.css';

interface SongListProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
  currentSong: Song | null;
}

const SongList: React.FC<SongListProps> = ({ songs, onSongClick, currentSong }) => {
  return (
    <div className="song-list">
      {songs.map(song => (
        <div
          key={song.id}
          className={`song-item ${currentSong && currentSong.id === song.id ? 'current-song' : ''}`}
          onClick={() => onSongClick(song)}
        >
          <span>{song.name}</span>
          <span>{song.artists}</span>
        </div>
      ))}
    </div>
  );
};

export default SongList;

import React from 'react';
import './SongList.module.css';
import { Song } from '../../types/types';

interface SongListProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, onSongClick }) => {
  return (
    <div className="song-list">
      {songs.map(song => (
        <div key={song.id} className="song-item" onClick={() => onSongClick(song)}>
          <span>{song.name}</span>
          <span>{song.artists}</span>
        </div>
      ))}
    </div>
  );
};

export default SongList;

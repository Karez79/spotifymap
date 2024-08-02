import React from 'react';
import { Song } from '../../types/types';
import './SongList.module.css';

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  return (
    <div className="songList">
      {songs.map((song) => (
        <div key={song.id} className="songItem">
          <p>{song.name} - {song.artists}</p>
        </div>
      ))}
    </div>
  );
};

export default SongList;

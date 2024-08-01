import React from 'react';
import { Song } from '../../types/types';

interface SongListProps {
  songs: Song[];
  setSelectedSong: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, setSelectedSong }) => {
  return (
    <div>
      {songs.map((song) => (
        <div key={song.id} onClick={() => setSelectedSong(song)}>
          {song.name} - {song.artists}
        </div>
      ))}
    </div>
  );
};

export default SongList;

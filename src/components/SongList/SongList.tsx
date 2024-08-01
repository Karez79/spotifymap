import React from 'react';
import { Song } from '../../types/types';
import styles from './SongList.module.css';

interface SongListProps {
  songs: Song[];
  setSelectedSong: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, setSelectedSong }) => {
  return (
    <div className={styles.songListContainer}>
      {songs.map((song) => (
        <div key={song.id} className={styles.songItem} onClick={() => setSelectedSong(song)}>
          {song.name} - {song.artists} - {song.streams}
        </div>
      ))}
    </div>
  );
};

export default SongList;

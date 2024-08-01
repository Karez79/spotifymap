import React, { useEffect, useState } from 'react';
import Canvas from './components/Canvas/Canvas';
import SongList from './components/SongList/SongList';
import songsData from './data/songs.json';
import { Song } from './types/types';
import './App.css';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    setSongs(songsData);
    setVisibleSongs(songsData.slice(0, 15));
  }, []);

  const loadMoreSongs = () => {
    setVisibleSongs(prevVisibleSongs => {
      const nextSongs = songs.slice(prevVisibleSongs.length, prevVisibleSongs.length + 15);
      return [...prevVisibleSongs, ...nextSongs];
    });
  };

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas songs={songs} />
      </div>
      <div className="song-list-container">
        <SongList songs={visibleSongs} setSelectedSong={setSelectedSong} />
        <button onClick={loadMoreSongs}>Load More</button>
      </div>
    </div>
  );
};

export default App;

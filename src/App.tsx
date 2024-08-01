import React, { useState, useEffect, useCallback } from 'react';
import { fetchSongs } from './data/data';
import Canvas from './components/Canvas/Canvas';
import SongList from './components/SongList/SongList';
import { Song } from './types/types';
import Tooltip from './components/Tooltip/Tooltip';
import './App.css';

const App = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSongs().then(fetchedSongs => {
      setSongs(fetchedSongs);
      setVisibleSongs(fetchedSongs.slice(0, 15)); // Load the first 15 songs initially
    });
  }, []);

  const loadMoreSongs = useCallback(() => {
    if (!loading && visibleSongs.length < songs.length) {
      setLoading(true);
      setTimeout(() => {
        const nextSongs = songs.slice(visibleSongs.length, visibleSongs.length + 15);
        setVisibleSongs(prevSongs => [...prevSongs, ...nextSongs]);
        setLoading(false);
      }, 1000); // Simulate loading delay
    }
  }, [loading, visibleSongs, songs]);

  return (
    <div className="app-container">
      <div className="canvas-container">
        {songs.length > 0 && <Canvas songs={visibleSongs} />}
      </div>
      <div className="songlist-container">
        <SongList songs={visibleSongs} setSelectedSong={setSelectedSong} />
        {visibleSongs.length < songs.length && (
          <button className="load-more-button" onClick={loadMoreSongs} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
      {selectedSong && <Tooltip song={selectedSong} />}
    </div>
  );
};

export default App;

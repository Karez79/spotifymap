import React, { useState, useEffect } from 'react';
import './App.css';
import SongList from './components/SongList/SongList';
import ThreeCanvas from './components/ThreeCanvas/ThreeCanvas';
import Tooltip from './components/Tooltip/Tooltip';
import { Song } from './types/types';
import { fetchSongs } from './data/data';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; song: Song } | null>(null);

  useEffect(() => {
    fetchSongs().then(data => {
      console.log("Fetched songs:", data); // Отладка для проверки загруженных песен
      setSongs(data);
      setVisibleSongs(data.slice(0, 15));
    }).catch(error => {
      console.error("Error fetching songs:", error);
    });
  }, []);

  const loadMoreSongs = () => {
    setVisibleSongs(prevVisibleSongs => [
      ...prevVisibleSongs,
      ...songs.slice(prevVisibleSongs.length, prevVisibleSongs.length + 15)
    ]);
  };

  return (
    <div className="App">
      <div className="left-pane">
        {visibleSongs.length > 0 ? <ThreeCanvas songs={visibleSongs} setTooltip={setTooltip} /> : <p>Loading...</p>}
      </div>
      <div className="right-pane">
        <SongList songs={visibleSongs} />
        <button onClick={loadMoreSongs}>Load More Songs</button>
      </div>
      {tooltip && <Tooltip song={tooltip.song} position={{ x: tooltip.x, y: tooltip.y }} />}
    </div>
  );
};

export default App;

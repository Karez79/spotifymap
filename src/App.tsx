import React, { useState, useEffect } from 'react';
import { drawSongs } from './components/Canvas/Canvas';
import { Song } from './types/types';
import SongList from './components/SongList/SongList';
// import './App.css';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    fetch('/src/data/Most Streamed Spotify Songs 2024.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split('\n').slice(1);
        const data = rows.map((row) => {
          const [id, name, artists, streams, ...features] = row.split(',');
          return {
            id: parseInt(id),
            name,
            artists,
            streams: parseInt(streams),
            features: features.map(Number),
          };
        });
        setSongs(data);
        drawSongs(data, setSelectedSong);
      });
  }, []);

  return (
    <div className="App">
      <h1>Spotify Song Similarity</h1>
      <canvas id="canvas" width="800" height="600"></canvas>
      <div>Selected Song: {selectedSong ? selectedSong.name : 'None'}</div>
      <SongList songs={songs} setSelectedSong={setSelectedSong} />
    </div>
  );
};

export default App;

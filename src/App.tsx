import React, { useState, useEffect } from 'react';
import './App.css';
import SongList from './components/SongList/SongList';
import ThreeCanvas from './components/ThreeCanvas/ThreeCanvas';
import Tooltip from './components/Tooltip/Tooltip';
import Player from './components/Player/Player';
import Recommendations from './components/Recommendations/Recommendations';
import { Song } from './types/types';
import { fetchSongs } from './data/data';
import { clusterSongs, findSimilarSongs } from './services/similarity';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; song: Song } | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const allSongs = await fetchSongs();
        console.log('Fetched songs:', allSongs);

        if (allSongs.length === 0) {
          console.error('No songs found.');
        }

        setSongs(allSongs);
        setVisibleSongs(allSongs.slice(0, 15)); // Загружаем только первые 15 песен
        clusterSongs(allSongs); // Кластеризуем песни
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, []);

  const loadMoreSongs = () => {
    const nextSongs = songs.slice(visibleSongs.length, visibleSongs.length + 15);
    setVisibleSongs(prevVisibleSongs => [...prevVisibleSongs, ...nextSongs]);
    console.log('Loading more songs:', nextSongs);
  };

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
    const similarSongs = findSimilarSongs(song, songs); // Найти похожие песни, передав оба аргумента
    setRecommendedSongs(similarSongs);
  };

  return (
    <div className="App">
      {visibleSongs.length > 0 && <ThreeCanvas songs={visibleSongs} setTooltip={setTooltip} />}
      <div className="left-pane">
        {currentSong && <Player song={currentSong} />}
      </div>
      <div className="right-pane">
        <SongList songs={visibleSongs} onSongClick={handleSongClick} />
        {visibleSongs.length < songs.length && (
          <button onClick={loadMoreSongs}>Load More Songs</button>
        )}
      </div>
      {tooltip && <Tooltip song={tooltip.song} position={{ x: tooltip.x, y: tooltip.y }} />}
      {recommendedSongs.length > 0 && (
        <Recommendations songs={recommendedSongs} onSongClick={handleSongClick} />
      )}
    </div>
  );
};

export default App;

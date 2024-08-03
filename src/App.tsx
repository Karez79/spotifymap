import React, { useState, useEffect } from 'react';
import './App.css';
import SongList from './components/SongList/SongList';
import ThreeCanvas from './components/ThreeCanvas/ThreeCanvas';
import Player from './components/Player/Player';
import Recommendations from './components/Recommendations/Recommendations';
import { Song } from './types/types';
import { fetchSongs } from './data/data';
import { findSimilarSongs } from './services/similarity';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [visibleRecommendedSongs, setVisibleRecommendedSongs] = useState<Song[]>([]);
  const [visibleSongPage, setVisibleSongPage] = useState(1);
  const [visibleRecommendedSongPage, setVisibleRecommendedSongPage] = useState(1);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const allSongs = await fetchSongs();
        console.log('Fetched songs:', allSongs);

        if (allSongs.length === 0) {
          console.error('No songs found.');
        }

        setSongs(allSongs);
        setVisibleSongs(allSongs.slice(0, 15));
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, []);

  const loadMoreSongs = () => {
    const nextPage = visibleSongPage + 1;
    const nextSongs = songs.slice(visibleSongs.length, visibleSongs.length + 15);
    setVisibleSongs((prevVisibleSongs) => [...prevVisibleSongs, ...nextSongs]);
    setVisibleSongPage(nextPage);
    console.log('Loading more songs:', nextSongs);
  };

  const loadMoreRecommendedSongs = () => {
    const nextPage = visibleRecommendedSongPage + 1;
    const nextRecommendedSongs = recommendedSongs.slice(visibleRecommendedSongs.length, visibleRecommendedSongs.length + 15);
    setVisibleRecommendedSongs((prevVisibleRecommendedSongs) => [...prevVisibleRecommendedSongs, ...nextRecommendedSongs]);
    setVisibleRecommendedSongPage(nextPage);
    console.log('Loading more recommended songs:', nextRecommendedSongs);
  };

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
    const similarSongPairs = findSimilarSongs(song, songs);
    const similarSongs = similarSongPairs.map((pair) => pair[1]);
    setRecommendedSongs(similarSongs);
    setVisibleRecommendedSongs(similarSongs.slice(0, 15));
  };

  console.log("Current song in App:", currentSong);

  return (
    <div className="App">
      {visibleSongs.length > 0 && <ThreeCanvas songs={visibleSongs} />}
      <div className="left-pane">
        {currentSong && <Player song={currentSong} allSongs={songs} onSongClick={handleSongClick} />}
        {visibleRecommendedSongs.length > 0 && (
          <div className="recommendations">
            <h2>Recommended Songs</h2>
            <ul>
              {visibleRecommendedSongs.map((song) => (
                <li key={song.id} onClick={() => handleSongClick(song)}>
                  {song.name} by {song.artists}
                </li>
              ))}
            </ul>
            {visibleRecommendedSongs.length < recommendedSongs.length && (
              <button onClick={loadMoreRecommendedSongs}>Load More Recommended Songs</button>
            )}
          </div>
        )}
      </div>
      <div className="right-pane">
        <div className="song-list">
          <h2>Songs</h2>
          <ul>
            {visibleSongs.map((song) => (
              <li key={song.id} onClick={() => handleSongClick(song)}>
                {song.name} by {song.artists}
              </li>
            ))}
          </ul>
          {visibleSongs.length < songs.length && (
            <button onClick={loadMoreSongs}>Load More Songs</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

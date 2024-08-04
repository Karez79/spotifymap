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
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Секундочку...");
  const [showSongHint, setShowSongHint] = useState(true);

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
        setLoadingText("Открываю...");
        setTimeout(() => setLoading(false), 1000); // Убираем прелоадер через 1 секунду
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, []);

  const loadMoreSongs = () => {
    const nextPage = visibleSongPage + 1;
    const nextSongs = songs.slice((nextPage - 1) * 15, nextPage * 15);
    setVisibleSongs(nextSongs);
    setVisibleSongPage(nextPage);
    console.log('Loading more songs:', nextSongs);
  };

  const loadPreviousSongs = () => {
    const previousPage = visibleSongPage - 1;
    const previousSongs = songs.slice((previousPage - 1) * 15, previousPage * 15);
    setVisibleSongs(previousSongs);
    setVisibleSongPage(previousPage);
    console.log('Loading previous songs:', previousSongs);
  };

  const loadMoreRecommendedSongs = () => {
    const nextPage = visibleRecommendedSongPage + 1;
    const nextRecommendedSongs = recommendedSongs.slice((nextPage - 1) * 15, nextPage * 15);
    setVisibleRecommendedSongs(nextRecommendedSongs);
    setVisibleRecommendedSongPage(nextPage);
    console.log('Loading more recommended songs:', nextRecommendedSongs);
  };

  const loadPreviousRecommendedSongs = () => {
    const previousPage = visibleRecommendedSongPage - 1;
    const previousRecommendedSongs = recommendedSongs.slice((previousPage - 1) * 15, previousPage * 15);
    setVisibleRecommendedSongs(previousRecommendedSongs);
    setVisibleRecommendedSongPage(previousPage);
    console.log('Loading previous recommended songs:', previousRecommendedSongs);
  };

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
    const similarSongPairs = findSimilarSongs(song, songs);
    const similarSongs = similarSongPairs.map((pair) => pair[1]);
    setRecommendedSongs(similarSongs);
    setVisibleRecommendedSongs(similarSongs.slice(0, 15));
    setVisibleRecommendedSongPage(1);
    setShowSongHint(false); // Скрываем подсказку после клика на песню
  };

  useEffect(() => {
    if (!loading) {
      document.querySelector('.left-pane')?.classList.add('fade-in');
      document.querySelector('.right-pane')?.classList.add('fade-in');
      document.querySelector('.player')?.classList.add('fade-in');
      const hintElement = document.querySelector('.song-hint');
      if (hintElement) {
        setTimeout(() => {
          hintElement.classList.add('show');
          setInterval(() => {
            hintElement.classList.toggle('shake');
          }, 5000); // Добавляем эффект тряски каждые 5 секунд
        }, 5000); // Показываем подсказку через 5 секунд
      }
    }
  }, [loading]);

  console.log("Current song in App:", currentSong);

  return (
    <div className="App">
      {loading ? (
        <div className="preloader">
          <div className="spinner"></div>
          <div className="preloader-text text-fade">{loadingText}</div>
        </div>
      ) : (
        <>
          {visibleSongs.length > 0 && <ThreeCanvas songs={visibleSongs} />}
          {showSongHint && <div className="song-hint">Нажмите на песню, чтобы ее послушать</div>}
          <div className="left-pane">
            {visibleRecommendedSongs.length > 0 && (
              <div className="recommendations">
                <h2>Recommended Songs</h2>
                <ul>
                  {visibleRecommendedSongs.map((song) => (
                    <li key={song.id} onClick={() => handleSongClick(song)} className={currentSong && currentSong.id === song.id ? 'current-song' : ''}>
                      {song.name} by {song.artists}
                    </li>
                  ))}
                </ul>
                <div className="page-buttons">
                  {visibleRecommendedSongPage > 1 && <button onClick={loadPreviousRecommendedSongs}>Previous</button>}
                  {visibleRecommendedSongs.length === 15 && <button onClick={loadMoreRecommendedSongs}>Next</button>}
                </div>
              </div>
            )}
          </div>
          <div className="right-pane">
            <div className="song-list">
              <h2>Songs</h2>
              <ul>
                {visibleSongs.map((song) => (
                  <li key={song.id} onClick={() => handleSongClick(song)} className={currentSong && currentSong.id === song.id ? 'current-song' : ''}>
                    {song.name} by {song.artists}
                  </li>
                ))}
              </ul>
              <div className="page-buttons">
                {visibleSongPage > 1 && <button onClick={loadPreviousSongs}>Previous</button>}
                {visibleSongs.length === 15 && <button onClick={loadMoreSongs}>Next</button>}
              </div>
            </div>
          </div>
          {currentSong && <Player song={currentSong} allSongs={songs} onSongClick={handleSongClick} />}
        </>
      )}
    </div>
  );
};

export default App;

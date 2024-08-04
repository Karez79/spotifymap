import React from 'react';
import { Song } from '../../types/types';
import './Recommendations.module.css';

interface RecommendationsProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ songs, onSongClick }) => {
  return (
    <div className="recommendations">
      <h2>Recommended Songs</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id} onClick={() => onSongClick(song)}>
            <strong>{song.name}</strong> by {Array.isArray(song.artists) ? song.artists.join(', ') : song.artists}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;

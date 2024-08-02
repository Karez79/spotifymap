// components/Recommendations/Recommendations.tsx

import React from 'react';
import { Song } from '../../types/types';

interface RecommendationsProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ songs, onSongClick }) => {
  return (
    <div className="recommendations">
      <h3>Recommended Songs</h3>
      <ul>
        {songs.map(song => (
          <li key={song.id} onClick={() => onSongClick(song)}>
            {song.name} - {song.artists}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;

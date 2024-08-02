import React from 'react';
import { Song } from '../../types/types';
import './Tooltip.module.css';

interface TooltipProps {
  song: Song;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ song, position }) => {
  return (
    <div className="tooltip" style={{ left: position.x, top: position.y }}>
      <p><strong>{song.name}</strong></p>
      <p>{song.artists}</p>
      <p>Streams: {song.streams}</p>
    </div>
  );
};

export default Tooltip;

import React from 'react';
import { Song } from '../../types/types';
import './Tooltip.module.css';
import '../../App.css';

interface TooltipProps {
  song: Song;
  position: { x: number; y: number };
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ song, position, visible }) => {
  return (
    <div
      className={`tooltip ${visible ? 'visible' : ''}`}
      style={{ left: position.x, top: position.y }}
    >
      <p><strong>{song.name}</strong></p>
      <p>{song.artists}</p>
      <p>Streams: {song.streams}</p>
    </div>
  );
};

export default Tooltip;

import React from 'react';
import { Song } from '../../types/types';
import styles from './Tooltip.module.css';

interface TooltipProps {
  song: Song;
}

const Tooltip: React.FC<TooltipProps> = ({ song }) => {
  return (
    <div className={styles.tooltip}>
      <h3>{song.name}</h3>
      <p>{song.artists}</p>
      <p>{song.streams.toLocaleString()} streams</p>
    </div>
  );
};

export default Tooltip;

import { Song } from '../../types/types';
import styles from './Tooltip.module.css';

let tooltip: HTMLDivElement | null;

export const showTooltip = (song: Song, x: number, y: number) => {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = styles.tooltip;
    document.body.appendChild(tooltip);
  }
  tooltip.innerHTML = `${song.name} by ${song.artists}`;
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  tooltip.style.display = 'block';
};

export const hideTooltip = () => {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
};

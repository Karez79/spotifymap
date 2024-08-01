import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import rawPlugin from 'vite-plugin-raw';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    rawPlugin({
      fileRegex: /\.csv$/,
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/data/Most Streamed Spotify Songs 2024.csv',
          dest: ''
        }
      ]
    })
  ],
});

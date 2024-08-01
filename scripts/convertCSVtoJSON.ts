import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Song } from '../src/types/types';

const csvFilePath = path.join(__dirname, '../src/data/Most Streamed Spotify Songs 2024.csv');
const jsonFilePath = path.join(__dirname, '../src/data/songs.json');

const convertCSVtoJSON = () => {
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const parsed = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
  });

  const jsonData: Song[] = parsed.data.map((data: any, index: number) => ({
    name: data.name,
    artists: data.artists,
    streams: data.streams,
    features: [
      Math.random(),
      Math.random(),
      Math.random()
    ],
    id: index + 1,
  }));

  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
};

convertCSVtoJSON();

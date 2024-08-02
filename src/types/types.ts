export interface Song {
  id: number;
  name: string;
  artists: string;
  streams: number;
  features: number[];
  spotifyId: string;
  previewUrl: string;
}

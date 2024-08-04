export interface Song {
  url: string | undefined;
  id: number;
  name: string;
  artists: string;
  streams: number;
  features: number[];
  spotifyId: string;
  previewUrl: string;
}

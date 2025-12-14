import { Song } from './types';

export const GRID_SIZE = 20;
export const GAME_SPEED_MS = 70;

// Dummy AI Generated Music placeholders (Using reliable creative commons sources from Google Storage Demos)
export const PLAYLIST: Song[] = [
  {
    id: '1',
    title: 'PAZA_MOD_SEQ',
    artist: 'PAZA',
    url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3',
    duration: '02:15'
  },
  {
    id: '2',
    title: 'LEPIDOPTERA_V1',
    artist: 'EPOQ',
    url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    duration: '04:20'
  },
  {
    id: '3',
    title: 'RACE_PROTOCOL',
    artist: 'UNKNOWN_UNIT',
    url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.mp3',
    duration: '01:50'
  }
];
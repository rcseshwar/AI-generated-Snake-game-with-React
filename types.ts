export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string; // URL to the audio file
  duration: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  GAME_OVER = 'GAME_OVER',
  PAUSED = 'PAUSED',
}

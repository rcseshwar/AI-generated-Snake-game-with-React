import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, AlertCircle } from 'lucide-react';
import { Song } from '../types';
import { PLAYLIST } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Dummy visualizer bars state
  const [bars, setBars] = useState<number[]>(new Array(12).fill(10));

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Reset error state on song change
    setError(false);
    
    const playAudio = async () => {
      if (audioRef.current) {
        if (isPlaying) {
          try {
            await audioRef.current.play();
          } catch (e) {
            console.error("Playback failed", e);
            // Don't set error state for interruptions, only for load failures which handle via onError
          }
        } else {
          audioRef.current.pause();
        }
      }
    };
    playAudio();
  }, [isPlaying, currentSongIndex]);

  // Fake visualizer effect
  useEffect(() => {
    if (!isPlaying) {
        setBars(new Array(12).fill(10));
        return;
    }
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex = direction === 'next' ? currentSongIndex + 1 : currentSongIndex - 1;
    if (nextIndex >= PLAYLIST.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = PLAYLIST.length - 1;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setError(false);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error event:", e);
    setError(true);
    setIsPlaying(false);
  };

  return (
    <div className="border-2 border-fuchsia-500 bg-black/80 p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(255,0,255,0.7)] max-w-md w-full mx-auto mt-8 relative group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400"></div>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={() => handleSkip('next')}
        onError={handleAudioError}
        preload="auto"
        crossOrigin="anonymous"
      />

      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400">
           <Music className="w-5 h-5 animate-pulse" />
           <span className="text-lg tracking-widest uppercase font-bold glitch-text" data-text="AUDIO_MOD">AUDIO_MOD</span>
        </div>
        <div className="text-xs text-fuchsia-500 animate-pulse">
           {error ? 'ERR_LOAD_FAIL' : isPlaying ? 'STREAMING...' : 'STANDBY'}
        </div>
      </div>

      <div className="mb-6 space-y-1">
        <h3 className="text-xl text-white font-bold tracking-wider truncate">
            {currentSong.title}
        </h3>
        <p className="text-sm text-cyan-600 truncate">{currentSong.artist}</p>
      </div>

      {/* Visualizer */}
      <div className="flex items-end justify-between h-16 mb-6 gap-1 relative">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/80 z-10 font-bold tracking-widest gap-2">
                <AlertCircle size={20} /> LINK_DEGRADED
            </div>
        )}
        {bars.map((height, i) => (
          <div 
            key={i} 
            className={`w-full bg-gradient-to-t ${error ? 'from-red-900 to-red-500' : 'from-fuchsia-900 to-fuchsia-500'} transition-all duration-100 ease-out`}
            style={{ height: error ? '20%' : `${height}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={() => handleSkip('prev')}
          className="group text-cyan-400 transition-all hover:scale-110 active:scale-95 focus:outline-none"
        >
          <SkipBack size={32} className="filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,1)] transition-all" />
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative w-20 h-20 flex items-center justify-center border-2 border-cyan-400 rounded-full text-cyan-400 
            transition-all duration-300
            shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)]
            hover:shadow-[0_0_35px_rgba(34,211,238,0.8),inset_0_0_20px_rgba(34,211,238,0.5)]
            hover:bg-cyan-400/10 hover:text-white active:scale-95 group"
        >
          {isPlaying ? (
             <Pause size={36} className="fill-cyan-400/20 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          ) : (
             <Play size={36} className="ml-1 fill-cyan-400/20 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          )}
        </button>

        <button 
          onClick={() => handleSkip('next')}
          className="group text-cyan-400 transition-all hover:scale-110 active:scale-95 focus:outline-none"
        >
          <SkipForward size={32} className="filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,1)] transition-all" />
        </button>
      </div>

      {/* Volume Mockup */}
      <div className="mt-8 flex items-center gap-2 text-fuchsia-500 opacity-60 hover:opacity-100 transition-opacity">
        <Volume2 size={16} />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-fuchsia-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(232,121,249,0.8)]"
        />
      </div>
    </div>
  );
};

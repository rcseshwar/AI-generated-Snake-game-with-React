import React, { useRef } from 'react';
import { GRID_SIZE } from '../constants';
import { GameStatus, Coordinate } from '../types';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface SnakeGameProps {
  snake: Coordinate[];
  food: Coordinate;
  status: GameStatus;
  score: number;
  resetGame: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ snake, food, status, score, resetGame }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isGameActive = status === GameStatus.RUNNING;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* HUD */}
      <div className="w-full flex justify-between items-end mb-2 px-2 border-b-2 border-cyan-500/30 pb-2">
        <div className="flex flex-col">
           <span className="text-xs text-fuchsia-500 tracking-widest">STATUS</span>
           <span className={`text-xl font-bold ${isGameActive ? 'text-green-400 animate-pulse' : 'text-red-500'}`}>
             {status === GameStatus.RUNNING ? 'SYSTEM_ONLINE' : status === GameStatus.IDLE ? 'AWAITING_INPUT' : 'SYSTEM_FAILURE'}
           </span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-fuchsia-500 tracking-widest">SCORE_INDEX</span>
           <span className="text-4xl font-bold text-cyan-400 font-mono leading-none">
             {score.toString().padStart(3, '0')}
           </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 bg-gray-900 border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
        {/* CRT curvature corner effects */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-fuchsia-500 z-20"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-fuchsia-500 z-20"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500 z-20"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500 z-20"></div>

        <div 
          ref={gridRef}
          className="grid gap-px bg-black/90 relative z-10"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {/* Background Grid Lines simulation */}
          <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
             {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-cyan-500/20"></div>
             ))}
          </div>

          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, i) => i !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = 'w-full h-full transition-all duration-75';
            
            if (isSnakeHead) {
              // Bright white-hot head with cyan glow
              cellClass += ' bg-white shadow-[0_0_15px_#00ffff] z-20 scale-110 relative';
            } else if (isSnakeBody) {
              // Glowing trail effect (Cyan body with strong glow)
              cellClass += ' bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10';
            } else if (isFood) {
              cellClass += ' bg-fuchsia-500 animate-pulse shadow-[0_0_15px_#d946ef] rounded-full scale-90';
            } else {
              cellClass += ' bg-transparent';
            }

            return <div key={`${x}-${y}`} className={cellClass} />;
          })}
        </div>

        {/* Overlays */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white glitch-text mb-4" data-text="READY?">READY?</h2>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold text-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all"
            >
              <Play size={20} /> INITIATE
            </button>
            <p className="mt-4 text-cyan-600 text-sm">ARROWS / WASD TO NAVIGATE</p>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md border-4 border-red-600 m-1">
            <AlertTriangle className="text-red-500 w-20 h-20 mb-4 animate-bounce filter drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            
            <h2 
              className="text-8xl md:text-9xl font-black text-red-600 glitch-text mb-2 tracking-tighter uppercase text-center leading-none filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
              data-text="FATAL ERROR"
            >
              FATAL ERROR
            </h2>
            
            <div className="flex items-center gap-3 text-2xl mb-8 font-mono border border-red-900 bg-red-950/30 px-4 py-2">
                <span className="text-red-400">FINAL_SCORE:</span>
                <span className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{score}</span>
            </div>

            <button 
              onClick={resetGame}
              className="group relative px-10 py-3 bg-transparent overflow-hidden transition-all hover:bg-red-600/20"
            >
              <div className="absolute inset-0 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
              <div className="flex items-center gap-3 relative z-10 text-red-500 font-bold text-2xl tracking-widest group-hover:text-white transition-colors">
                <RotateCcw size={28} className="group-hover:rotate-180 transition-transform duration-500" /> 
                REBOOT_SYSTEM
              </div>
            </button>
          </div>
        )}
      </div>
      
      {/* Decorative text */}
      <div className="w-full flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
         <span>MEM: 64KB OK</span>
         <span>V 1.0.4</span>
         <span>INPUT: KEYBOARD</span>
      </div>
    </div>
  );
};

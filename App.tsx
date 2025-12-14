import React from 'react';
import { GlitchLayout } from './components/GlitchLayout';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { AiSystemLog } from './components/AiSystemLog';
import { useSnakeGame } from './hooks/useSnakeGame';
import { Terminal } from 'lucide-react';

function App() {
  const snakeGameState = useSnakeGame();

  return (
    <GlitchLayout>
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col justify-center items-center relative z-20">
        
        {/* Header */}
        <header className="w-full max-w-4xl flex items-center justify-between mb-8 border-b-2 border-fuchsia-500/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500 text-black shadow-[0_0_15px_rgba(232,121,249,0.8)]">
               <Terminal size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none glitch-text" data-text="NEON_SERPENT">
                NEON_SERPENT
              </h1>
              <p className="text-xs text-cyan-400 tracking-[0.3em] animate-pulse">HYBRID ENTERTAINMENT MODULE</p>
            </div>
          </div>
          <div className="hidden md:block text-right font-mono">
             <p className="text-xs text-fuchsia-500">CONN: SECURE</p>
             <p className="text-xs text-cyan-500">ENCRYPTION: 256-BIT</p>
          </div>
        </header>

        {/* Main Interface Layout */}
        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Game (Larger Area) */}
          <section className="flex justify-center order-1 lg:col-span-7">
            <SnakeGame {...snakeGameState} />
          </section>

          {/* Right Column: Music & Info */}
          <section className="flex flex-col gap-6 order-2 lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
             
             {/* Music Player Module */}
             <MusicPlayer />

             {/* Dynamic AI Log */}
             <AiSystemLog status={snakeGameState.status} score={snakeGameState.score} />
             
          </section>

        </main>
        
        <footer className="mt-auto py-6 text-center text-gray-700 text-xs font-mono">
          <p className="mb-1">POWERED BY GEMINI 2.5 FLASH</p>
          <p>© 2077 NEON CORP INDUSTRIES. ALL RIGHTS RESERVED.</p>
        </footer>

      </div>
    </GlitchLayout>
  );
}

export default App;

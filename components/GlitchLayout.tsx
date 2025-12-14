import React from 'react';

export const GlitchLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-black text-cyan-400 overflow-hidden selection:bg-fuchsia-500 selection:text-white">
      {/* CSS Injection for Keyframes */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0% { opacity: 0.95; }
          5% { opacity: 0.8; }
          10% { opacity: 0.9; }
          15% { opacity: 0.4; }
          20% { opacity: 0.95; }
          50% { opacity: 0.95; }
          55% { opacity: 0.7; }
          60% { opacity: 0.95; }
          100% { opacity: 0.95; }
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }
        
        .crt-scanline {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
          );
          background-size: 100% 4px;
          animation: flicker 0.15s infinite;
          pointer-events: none;
        }
        
        .scan-bar {
          width: 100%;
          height: 10px;
          background: rgba(0, 255, 255, 0.1);
          opacity: 0.1;
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }

        .glitch-text {
          position: relative;
        }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff00ff;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 #00ffff;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-1 3s infinite linear alternate-reverse;
        }
      `}</style>

      {/* CRT Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none crt-scanline opacity-20"></div>
      <div className="absolute inset-0 z-50 pointer-events-none scan-bar"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

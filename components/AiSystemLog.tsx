import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GameStatus } from '../types';
import { Terminal, Cpu } from 'lucide-react';

interface AiSystemLogProps {
  status: GameStatus;
  score: number;
}

export const AiSystemLog: React.FC<AiSystemLogProps> = ({ status, score }) => {
  const [log, setLog] = useState<string>("> SYSTEM_READY\n> AWAITING_INPUT...");
  const [isThinking, setIsThinking] = useState(false);
  const prevStatus = useRef<GameStatus>(status);
  const prevScore = useRef<number>(score);

  useEffect(() => {
    // Only trigger on specific state changes to save tokens/avoid spam
    let shouldTrigger = false;
    let prompt = "";

    if (prevStatus.current !== status) {
      if (status === GameStatus.RUNNING && prevStatus.current === GameStatus.IDLE) {
        prompt = "The user has initiated the 'Neon Serpent' protocol. Generate a single-line, cool, cryptic, cyberpunk system boot message. Use uppercase.";
        shouldTrigger = true;
      } else if (status === GameStatus.GAME_OVER) {
        prompt = `FATAL ERROR. The user crashed the snake. Score: ${score}. Generate a cynical, glitchy, mocking system error message. 1 sentence.`;
        shouldTrigger = true;
      }
      prevStatus.current = status;
    } else if (status === GameStatus.RUNNING && score > 0 && score % 5 === 0 && score !== prevScore.current) {
      // Milestone every 5 points
      prompt = `Score updated to ${score}. Generate a short, enthusiastic, machine-like praise or observation. Keep it under 10 words.`;
      shouldTrigger = true;
      prevScore.current = score;
    }

    if (shouldTrigger && process.env.API_KEY) {
      const fetchLog = async () => {
        setIsThinking(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are the central AI core of a retro-futurist cyberpunk interface. Your tone is robotic, slightly menacing, and glitchy. Use technical jargon.",
                maxOutputTokens: 60,
            }
          });
          
          if (response.text) {
             setLog((prev) => `> ${response.text}\n${prev}`.slice(0, 500)); // Keep history limited
          }
        } catch (e) {
          console.error("AI_CORE_FAILURE", e);
          setLog((prev) => `> [CONNECTION_LOST] UNABLE TO SYNC WITH AI CORE.\n${prev}`);
        } finally {
          setIsThinking(false);
        }
      };
      fetchLog();
    }
  }, [status, score]);

  return (
    <div className="border border-cyan-900 bg-black/80 p-4 font-mono text-sm w-full max-w-md mx-auto relative overflow-hidden group">
      {/* Scanning effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent translate-y-[-100%] group-hover:animate-[scanline_2s_linear_infinite]" />
      
      <div className="flex items-center justify-between text-cyan-600 border-b border-cyan-900 mb-2 pb-1 text-xs">
        <div className="flex items-center gap-2">
            <Cpu size={14} className={isThinking ? "animate-spin text-fuchsia-500" : ""} />
            <span>AI_CORE_LOG_V2.1</span>
        </div>
        <div className={isThinking ? "text-fuchsia-500 animate-pulse" : "text-cyan-800"}>
            {isThinking ? "PROCESSING..." : "IDLE"}
        </div>
      </div>
      
      <div className="h-32 overflow-y-auto flex flex-col-reverse text-xs md:text-sm scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
        <pre className="whitespace-pre-wrap text-cyan-400 font-vt323 leading-tight">
          {log}
        </pre>
      </div>
      
      <div className="mt-2 text-[10px] text-gray-600 flex justify-between">
         <span>MODEL: GEMINI-2.5-FLASH</span>
         <span>LATENCY: {Math.floor(Math.random() * 20) + 5}ms</span>
      </div>
    </div>
  );
};

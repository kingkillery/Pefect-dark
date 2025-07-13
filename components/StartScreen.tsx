
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-gray-900/80 flex flex-col justify-center items-center text-center z-20 backdrop-blur-sm">
      <h1 className="text-7xl font-black text-cyan-300 uppercase tracking-wider" style={{ textShadow: '0 0 15px #0ff' }}>
        Deathmatch Arena
      </h1>
      <p className="text-xl text-gray-300 mt-2 max-w-2xl">
        You are dropped into a futuristic arena against hostile bots. Be the first to reach {20} kills to win.
      </p>
      
      <div className="mt-12 text-left bg-black/30 p-6 rounded-lg border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Controls</h2>
        <ul className="space-y-2 text-lg text-gray-200">
            <li><strong className="text-cyan-300 w-24 inline-block">W, A, S, D:</strong> Move</li>
            <li><strong className="text-cyan-300 w-24 inline-block">Shift:</strong> Sprint</li>
            <li><strong className="text-cyan-300 w-24 inline-block">Spacebar:</strong> Jump</li>
            <li><strong className="text-cyan-300 w-24 inline-block">Mouse:</strong> Aim</li>
            <li><strong className="text-cyan-300 w-24 inline-block">Click:</strong> Shoot</li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="mt-12 px-12 py-4 bg-cyan-500 text-gray-900 text-2xl font-bold uppercase rounded-md transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;

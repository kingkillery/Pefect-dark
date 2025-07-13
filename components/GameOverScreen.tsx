
import React from 'react';
import { PlayerStats } from '../types';

interface GameOverScreenProps {
  winner: string;
  playerStats: PlayerStats;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, playerStats, onRestart }) => {
  const isPlayerWinner = winner === 'Player';

  return (
    <div className="absolute inset-0 bg-gray-900/90 flex flex-col justify-center items-center text-center z-20 backdrop-blur-sm">
      <h1 className={`text-8xl font-black uppercase tracking-wider ${isPlayerWinner ? 'text-green-400' : 'text-red-500'}`}
          style={{ textShadow: isPlayerWinner ? '0 0 20px #4f4' : '0 0 20px #f44' }}>
        {isPlayerWinner ? 'Victory' : 'Defeat'}
      </h1>
      <p className="text-2xl text-gray-300 mt-2">
        {winner} is the winner!
      </p>

      <div className="mt-10 bg-black/30 p-6 rounded-lg border border-white/20 w-80">
        <h2 className="text-2xl font-bold text-white mb-4">Final Score</h2>
        <div className="flex justify-between text-xl">
            <span className="text-gray-300">Kills:</span>
            <span className="font-bold text-green-400">{playerStats.kills}</span>
        </div>
        <div className="flex justify-between text-xl mt-2">
            <span className="text-gray-300">Deaths:</span>
            <span className="font-bold text-red-400">{playerStats.deaths}</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-12 px-12 py-4 bg-cyan-500 text-gray-900 text-2xl font-bold uppercase rounded-md transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;

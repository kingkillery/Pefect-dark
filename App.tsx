
import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import HUD from './components/HUD';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState, PlayerStats } from './types';
import { INITIAL_PLAYER_STATS, KILLS_TO_WIN } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);
  const [winner, setWinner] = useState<string | null>(null);

  const handleStartGame = useCallback(() => {
    setPlayerStats(INITIAL_PLAYER_STATS);
    setWinner(null);
    setGameState(GameState.PLAYING);
  }, []);

  const handleGameOver = useCallback((winPlayer: string) => {
    setWinner(winPlayer);
    setGameState(GameState.GAME_OVER);
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white font-mono">
      {gameState === GameState.MENU && <StartScreen onStart={handleStartGame} />}
      
      {gameState === GameState.GAME_OVER && winner && (
        <GameOverScreen winner={winner} playerStats={playerStats} onRestart={handleStartGame} />
      )}

      {gameState === GameState.PLAYING && (
        <>
          <HUD stats={playerStats} killsToWin={KILLS_TO_WIN} />
          <Game 
            setPlayerStats={setPlayerStats} 
            onGameOver={handleGameOver} 
          />
        </>
      )}
    </div>
  );
};

export default App;

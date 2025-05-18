
import React from 'react';
import { GameProvider, useGame } from '../GameContext';
import GameMap from './GameMap';
import TowerSelector from './TowerSelector';
import TowerDetails from './TowerDetails';
import GameStats from './GameStats';
import HomeScreen from './HomeScreen';
import DefeatScreen from './DefeatScreen';
import VictoryScreen from './VictoryScreen';

const GameContent: React.FC = () => {
  const { state } = useGame();
  
  // Render screens based on game status
  if (state.gameStatus === 'notStarted') {
    return <HomeScreen />;
  }
  
  if (state.gameStatus === 'defeat') {
    return <DefeatScreen />;
  }
  
  if (state.gameStatus === 'victory') {
    return <VictoryScreen />;
  }
  
  // Default game UI
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <GameMap />
      </div>
      
      <div className="space-y-4">
        <GameStats />
        <TowerSelector />
        <TowerDetails />
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-game-wood-light p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-game-parchment mb-4">
            Zombies at the King's Gate
          </h1>
          
          <GameContent />
          
          <div className="mt-4 text-center text-game-parchment text-sm">
            <p>Defend the King's Tower from the zombie horde!</p>
            <p>Place towers strategically to block the path and destroy the zombies.</p>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Game;

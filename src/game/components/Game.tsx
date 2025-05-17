
import React from 'react';
import { GameProvider } from '../GameContext';
import GameMap from './GameMap';
import TowerSelector from './TowerSelector';
import TowerDetails from './TowerDetails';
import GameStats from './GameStats';

const Game: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-game-wood-light p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-game-parchment mb-4">
            Zombies at the King's Gate
          </h1>
          
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

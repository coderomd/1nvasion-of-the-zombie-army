
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '../GameContext';
import { ArrowRight, Play } from 'lucide-react';

const HomeScreen: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-game-parchment rounded-lg border-4 border-game-wood-dark shadow-xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-game-wood-dark mb-6 text-center">
        Zombies at the King&apos;s Gate
      </h1>
      
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center space-y-4">
          <p className="text-lg text-game-wood-dark">
            The undead horde approaches! Place towers to defend the kingdom from the zombie invasion.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">🛡️</span>
              <p className="text-sm mt-2">Knight Towers</p>
            </div>
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">🏹</span>
              <p className="text-sm mt-2">Archer Towers</p>
            </div>
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">💣</span>
              <p className="text-sm mt-2">Cannon Towers</p>
            </div>
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">⛏️</span>
              <p className="text-sm mt-2">Gold Miners</p>
            </div>
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">🔨</span>
              <p className="text-sm mt-2">Blacksmiths</p>
            </div>
            <div className="bg-game-wood-light/70 p-3 rounded-md shadow-md">
              <span className="text-3xl">🧟</span>
              <p className="text-sm mt-2">Zombies!</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            onClick={startGame} 
            className="bg-game-gold-dark hover:bg-game-gold-light text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Start Game <Play size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

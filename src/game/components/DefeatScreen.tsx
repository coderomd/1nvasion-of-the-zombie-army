
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '../GameContext';
import { ArrowLeft } from 'lucide-react';

const DefeatScreen: React.FC = () => {
  // Access the game context to restart the game
  const { state, dispatch } = useGame();
  
  // Handle restart game
  const handleRestart = () => {
    // This will reset the game state and return to home screen
    window.location.reload();
  };

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-game-wood-dark rounded-lg border-4 border-game-gold-dark shadow-2xl">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-red-600 mb-6">
          Defeat!
        </h1>
        
        <div className="text-game-parchment text-xl mb-8">
          <p className="mb-4">The kingdom has fallen to the zombie horde!</p>
          <p>You survived {state.waveNumber} waves.</p>
        </div>
        
        <div className="bg-black/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <h2 className="text-game-gold-light text-xl mb-2">Battle Report</h2>
          <div className="grid grid-cols-2 gap-3 text-game-parchment">
            <div>Waves Completed:</div>
            <div>{state.waveNumber - 1}</div>
            <div>Towers Built:</div>
            <div>{state.towers.length}</div>
            <div>Gold Remaining:</div>
            <div>{state.gold}</div>
          </div>
        </div>
        
        <Button
          onClick={handleRestart}
          className="bg-game-gold-dark hover:bg-game-gold-light text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Try Again
        </Button>
      </div>
    </div>
  );
};

export default DefeatScreen;

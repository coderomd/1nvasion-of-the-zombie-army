
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '../GameContext';
import { ArrowLeft, Trophy, Repeat } from 'lucide-react';

const VictoryScreen: React.FC = () => {
  // Access the game context
  const { state, continueAfterVictory } = useGame();
  
  // Handle restart game
  const handleRestart = () => {
    // This will reset the game state and return to home screen
    window.location.reload();
  };

  // Handle continue playing
  const handleContinue = () => {
    // This will add more waves and continue the game
    continueAfterVictory();
  };

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-game-gold-light rounded-lg border-4 border-game-wood-dark shadow-2xl">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-game-wood-dark mb-6">
          Victory!
        </h1>
        
        <div className="text-game-wood-dark text-xl mb-8">
          <p>The kingdom is saved!</p>
          <p>You've defeated all {state.totalWaves} waves of zombies.</p>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <h2 className="text-game-wood-dark text-xl mb-2">Battle Report</h2>
          <div className="grid grid-cols-2 gap-3 text-game-wood-dark">
            <div>Waves Completed:</div>
            <div>{state.waveNumber}</div>
            <div>Towers Built:</div>
            <div>{state.towers.length}</div>
            <div>Lives Remaining:</div>
            <div>{state.lives}</div>
            <div>Gold Remaining:</div>
            <div>{state.gold}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleContinue}
            className="bg-game-wood-dark hover:bg-game-wood-medium text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Repeat size={20} /> Continue Playing
          </Button>
          
          <Button
            onClick={handleRestart}
            className="bg-game-gold-dark hover:bg-game-gold-medium text-game-wood-dark font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;

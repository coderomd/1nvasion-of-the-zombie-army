
import React from 'react';
import { useGame } from '../GameContext';
import { EXTRA_LIFE_BASE_COST, EXTRA_LIFE_COST_MULTIPLIER, INITIAL_GAME_STATE } from '../constants';

const GameStats: React.FC = () => {
  const { state, buyLife, startWave } = useGame();
  const { gold, lives, waveNumber, totalWaves, wave, gameStatus, goldMultiplier } = state;
  
  // Calculate the cost of an extra life
  const extraLifeCost = Math.round(
    EXTRA_LIFE_BASE_COST * 
    Math.pow(EXTRA_LIFE_COST_MULTIPLIER, lives - INITIAL_GAME_STATE.lives)
  );
  
  const canAffordLife = gold >= extraLifeCost;
  
  // Format gold multiplier as percentage
  const goldMultiplierPercentage = Math.round(goldMultiplier * 100);

  return (
    <div className="game-panel">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-xl">💰</span>
            <span className="font-bold">{gold}</span>
            <span className="text-xs text-yellow-500">({goldMultiplierPercentage}% rewards)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xl">❤️</span>
            <span className="font-bold">{lives}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold">Wave {waveNumber} / {totalWaves}</div>
          
          {gameStatus === 'defeat' && (
            <div className="text-red-600 font-bold mt-1">DEFEAT!</div>
          )}
          
          {gameStatus === 'victory' && (
            <div className="text-green-600 font-bold mt-1">VICTORY!</div>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex gap-2">
        {/* Only show start wave button if game is not in progress */}
        {(gameStatus === 'notStarted' || (wave.completed && waveNumber < totalWaves)) && (
          <button 
            onClick={startWave}
            className="game-button flex-1"
          >
            {gameStatus === 'notStarted' ? 'Start Game' : `Start Wave ${waveNumber + 1}`}
          </button>
        )}
        
        {/* Show buy life button */}
        <button 
          onClick={buyLife}
          disabled={!canAffordLife}
          className={`game-button flex-1 ${!canAffordLife ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Buy Life ({extraLifeCost} 💰)
        </button>
      </div>
    </div>
  );
};

export default GameStats;

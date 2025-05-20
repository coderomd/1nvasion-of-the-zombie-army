
import React, { useEffect } from 'react';
import { CELL_SIZE } from '../constants';
import { useGame } from '../GameContext';
import { GoldIndicator as GoldIndicatorType } from '../types';

interface GoldIndicatorProps {
  indicator: GoldIndicatorType;
}

const GoldIndicator: React.FC<GoldIndicatorProps> = ({ indicator }) => {
  const { dispatch } = useGame();
  const { position, amount, id } = indicator;
  
  // Position the indicator above the tower
  const x = position.x * CELL_SIZE + CELL_SIZE / 2;
  const y = position.y * CELL_SIZE - 20; // Slightly above the tower
  
  // Remove the indicator after its duration
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_GOLD_INDICATOR', payload: id });
    }, indicator.duration);
    
    return () => clearTimeout(timer);
  }, [id, indicator.duration, dispatch]);
  
  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center z-20"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'float-up 2s ease-out',
      }}
    >
      <div className="text-game-gold-light font-bold text-sm bg-black bg-opacity-70 px-2 py-1 rounded-full border border-game-gold-dark shadow-lg">
        +{amount} 💰
      </div>
    </div>
  );
};

export default GoldIndicator;

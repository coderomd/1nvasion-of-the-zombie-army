
import React, { useEffect, useState } from 'react';
import { Tower } from '../types';
import { CELL_SIZE } from '../constants';

interface TowerProps {
  tower: Tower;
}

const TowerComponent: React.FC<TowerProps> = ({ tower }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Track tower attack state to trigger animation
  useEffect(() => {
    if (tower.isAttacking && tower.attackAnimationEnd && tower.attackAnimationEnd > Date.now()) {
      setIsAnimating(true);
      
      // Set a timeout to end the animation
      const timeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Animation duration
      
      return () => clearTimeout(timeoutId);
    }
  }, [tower.isAttacking, tower.attackAnimationEnd]);

  const towerStyles: Record<string, React.CSSProperties> = {
    knight: {
      backgroundColor: '#A52A2A',
      border: '2px solid #8B0000'
    },
    archer: {
      backgroundColor: '#556B2F',
      border: '2px solid #2F4F4F'
    },
    cannon: {
      backgroundColor: '#444444',
      border: '2px solid #000000'
    },
    goldMiner: {
      backgroundColor: '#D4AF37',
      border: '2px solid #B8860B'
    },
    blacksmith: {
      backgroundColor: '#8B4513',
      border: '2px solid #654321'
    }
  };

  const getTowerIcon = (type: string): string => {
    switch (type) {
      case 'knight': return '🛡️';
      case 'archer': return '🏹';
      case 'cannon': return '💣';
      case 'goldMiner': return '⛏️';
      case 'blacksmith': return '🔨';
      default: return '🗿';
    }
  };
  
  const getAttackAnimation = (type: string): string => {
    switch (type) {
      case 'knight': return 'animate-[bounce_0.3s_ease-in-out]';
      case 'archer': return 'animate-[pulse_0.3s_ease-in-out]';
      case 'cannon': return 'animate-[ping_0.5s_ease-in-out]';
      case 'goldMiner': return 'animate-[spin_0.5s_ease-in-out]';
      case 'blacksmith': return 'animate-[pulse_0.3s_ease-in-out]';
      default: return '';
    }
  };

  return (
    <div className="tower">
      <div 
        className={`w-4/5 h-4/5 rounded-full flex items-center justify-center text-white font-bold relative ${isAnimating ? getAttackAnimation(tower.type) : ''}`}
        style={towerStyles[tower.type]}
      >
        <span className="text-xl">{getTowerIcon(tower.type)}</span>
        <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {tower.level}
        </span>
        
        {/* Attack effect overlay */}
        {isAnimating && (
          <div className={`absolute inset-0 rounded-full ${tower.type === 'archer' ? 'border-2 border-yellow-400 animate-ping' : 
                                                tower.type === 'cannon' ? 'bg-red-500/30 animate-ping' : 
                                                tower.type === 'knight' ? 'border-2 border-red-600 animate-pulse' : 
                                                'border-2 border-white animate-pulse'}`}>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerComponent;


import React, { useEffect, useState } from 'react';
import { Tower } from '../types';
import { CELL_SIZE } from '../constants';
import { useGame } from '../GameContext';

interface TowerProps {
  tower: Tower;
}

const TowerComponent: React.FC<TowerProps> = ({ tower }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { state } = useGame();
  const isSelected = state.selectedTower?.id === tower.id;
  const [isHovered, setIsHovered] = useState(false);

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
      background: 'radial-gradient(circle, #A52A2A 60%, #8B0000 100%)',
      boxShadow: '0 0 10px rgba(165, 42, 42, 0.5)',
      border: '2px solid #8B0000'
    },
    archer: {
      background: 'radial-gradient(circle, #556B2F 60%, #2F4F4F 100%)',
      boxShadow: '0 0 10px rgba(85, 107, 47, 0.5)',
      border: '2px solid #2F4F4F'
    },
    cannon: {
      background: 'radial-gradient(circle, #444444 60%, #000000 100%)',
      boxShadow: '0 0 10px rgba(68, 68, 68, 0.5)',
      border: '2px solid #000000'
    },
    goldMiner: {
      background: 'radial-gradient(circle, #D4AF37 60%, #B8860B 100%)',
      boxShadow: '0 0 10px rgba(212, 175, 55, 0.7)',
      border: '2px solid #B8860B'
    },
    blacksmith: {
      background: 'radial-gradient(circle, #8B4513 60%, #654321 100%)',
      boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)',
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

  // Only show range indicator for selected towers or when hovering, NOT during attacks
  const showRangeIndicator = isSelected || isHovered;

  return (
    <div 
      className="tower absolute"
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        left: tower.position.x * CELL_SIZE,
        top: tower.position.y * CELL_SIZE,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-4/5 h-4/5 rounded-full flex items-center justify-center text-white font-bold relative ${isAnimating ? getAttackAnimation(tower.type) : ''}`}
        style={{
          ...towerStyles[tower.type],
          margin: '10%',
          transition: 'all 0.3s ease',
          transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
          outline: isSelected ? '2px solid white' : 'none',
        }}
      >
        <span className="text-xl drop-shadow-lg">{getTowerIcon(tower.type)}</span>
        <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-md">
          {tower.level}
        </span>
        
        {/* Range indicator (only visible when selected or hovered, not during attacks) */}
        {showRangeIndicator && tower.range > 0 && (
          <div 
            className="absolute rounded-full border border-white/30 bg-white/5 z-0 pointer-events-none"
            style={{
              width: tower.range * 2 * CELL_SIZE,
              height: tower.range * 2 * CELL_SIZE,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        
        {/* Attack effect overlay */}
        {isAnimating && (
          <div className={`absolute inset-0 rounded-full ${tower.type === 'archer' ? 'border-2 border-yellow-400 animate-ping' : 
                                                tower.type === 'cannon' ? 'bg-red-500/30 animate-ping' : 
                                                tower.type === 'knight' ? 'border-2 border-red-600 animate-pulse' : 
                                                tower.type === 'goldMiner' ? 'bg-yellow-300/30 animate-spin' :
                                                'border-2 border-orange-500 animate-pulse'}`}>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerComponent;

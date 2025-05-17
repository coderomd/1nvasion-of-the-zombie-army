
import React from 'react';
import { Tower } from '../types';
import { CELL_SIZE } from '../constants';

interface TowerProps {
  tower: Tower;
}

const TowerComponent: React.FC<TowerProps> = ({ tower }) => {
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
  
  return (
    <div className="tower">
      <div 
        className="w-4/5 h-4/5 rounded-full flex items-center justify-center text-white font-bold relative"
        style={towerStyles[tower.type]}
      >
        <span className="text-xl">{getTowerIcon(tower.type)}</span>
        <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {tower.level}
        </span>
      </div>
    </div>
  );
};

export default TowerComponent;


import React from 'react';
import { Enemy } from '../types';
import { CELL_SIZE } from '../constants';

interface EnemyProps {
  enemy: Enemy;
}

const EnemyComponent: React.FC<EnemyProps> = ({ enemy }) => {
  const enemyStyles: Record<string, React.CSSProperties> = {
    basicZombie: {
      backgroundColor: '#8B0000',
      border: '2px solid #A52A2A'
    },
    fastZombie: {
      backgroundColor: '#FF4500',
      border: '2px solid #FF8C00'
    },
    armoredZombie: {
      backgroundColor: '#696969',
      border: '2px solid #A9A9A9'
    },
    spitterZombie: {
      backgroundColor: '#006400',
      border: '2px solid #228B22'
    }
  };

  const getEnemyIcon = (type: string): string => {
    switch (type) {
      case 'basicZombie': return '🧟';
      case 'fastZombie': return '🏃';
      case 'armoredZombie': return '🛡️';
      case 'spitterZombie': return '🧪';
      default: return '👾';
    }
  };

  return (
    <div 
      className="enemy animate-zombie-walk"
      style={{
        width: CELL_SIZE * 0.7,
        height: CELL_SIZE * 0.7,
        left: enemy.position.x * CELL_SIZE + (CELL_SIZE * 0.15),
        top: enemy.position.y * CELL_SIZE + (CELL_SIZE * 0.15),
      }}
    >
      <div 
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold relative"
        style={enemyStyles[enemy.type]}
      >
        <span>{getEnemyIcon(enemy.type)}</span>
        
        {/* Health bar */}
        <div className="absolute -top-2 left-0 w-full h-1 bg-red-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600" 
            style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnemyComponent;

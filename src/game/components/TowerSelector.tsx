
import React from 'react';
import { useGame } from '../GameContext';
import { TowerType } from '../types';
import { TOWER_BASE_STATS, TOWER_DESCRIPTIONS } from '../constants';

const TowerSelector: React.FC = () => {
  const { state, selectTowerType } = useGame();
  const { gold, selectedTowerType } = state;
  
  const towers = [
    { type: TowerType.KNIGHT, name: 'Knight', icon: '🛡️' },
    { type: TowerType.ARCHER, name: 'Archer', icon: '🏹' },
    { type: TowerType.CANNON, name: 'Cannon', icon: '💣' },
    { type: TowerType.GOLD_MINER, name: 'Gold Miner', icon: '⛏️' },
    { type: TowerType.BLACKSMITH, name: 'Blacksmith', icon: '🔨' },
  ];
  
  const handleSelectTower = (type: TowerType) => {
    selectTowerType(selectedTowerType === type ? null : type);
  };

  return (
    <div className="game-panel">
      <h2 className="text-lg font-bold mb-2 text-game-wood-dark">Defense Units</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {towers.map((tower) => {
          const towerCost = TOWER_BASE_STATS[tower.type].cost;
          const canAfford = gold >= towerCost;
          
          return (
            <div 
              key={tower.type}
              onClick={() => canAfford && handleSelectTower(tower.type)}
              className={`
                p-2 rounded-md border-2 cursor-pointer flex items-center gap-2
                ${selectedTowerType === tower.type ? 'bg-game-gold-dark text-white border-game-gold-light' : 
                  canAfford ? 'bg-white hover:bg-gray-100 border-gray-300' : 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed'}
              `}
            >
              <div className="text-2xl">{tower.icon}</div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-sm">{tower.name}</span>
                <span className="text-xs">Cost: {towerCost} 💰</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedTowerType && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <p>Select a location on the map to place the {selectedTowerType} tower.</p>
          <p className="mt-1">{TOWER_DESCRIPTIONS[selectedTowerType]}</p>
        </div>
      )}
    </div>
  );
};

export default TowerSelector;

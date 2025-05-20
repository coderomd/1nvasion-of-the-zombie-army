
import React from 'react';
import { useGame } from '../GameContext';
import { Button } from '@/components/ui/button';
import { CELL_SIZE } from '../constants';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TowerDetails: React.FC = () => {
  const { state, upgradeTower, sellTower, selectTower } = useGame();
  const { selectedTower, gold } = state;
  
  if (!selectedTower) return null;
  
  const canAffordUpgrade = gold >= selectedTower.upgradeCost;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'knight': return 'Knight';
      case 'archer': return 'Archer';
      case 'cannon': return 'Cannon';
      case 'goldMiner': return 'Gold Miner';
      case 'blacksmith': return 'Blacksmith';
      default: return type;
    }
  };
  
  const getBuffDescription = (type: string) => {
    switch (type) {
      case 'blacksmith': return "Buffs nearby Knights' damage and Gold Miners' production";
      default: return "";
    }
  };

  const handleUpgradeTower = () => {
    if (canAffordUpgrade && selectedTower) {
      upgradeTower(selectedTower);
    }
  };

  const handleSellTower = () => {
    if (selectedTower) {
      sellTower(selectedTower);
    }
  };

  return (
    <div className="game-panel">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-game-wood-dark">Tower Details</h2>
        <button 
          onClick={() => selectTower(null)} 
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="mt-2">
        <div className="flex items-center mb-2">
          <div className="text-2xl mr-2">
            {selectedTower.type === 'knight' && '🛡️'}
            {selectedTower.type === 'archer' && '🏹'}
            {selectedTower.type === 'cannon' && '💣'}
            {selectedTower.type === 'goldMiner' && '⛏️'}
            {selectedTower.type === 'blacksmith' && '🔨'}
          </div>
          <div>
            <div className="font-bold">{getTypeLabel(selectedTower.type)}</div>
            <div className="text-xs">Level {selectedTower.level}</div>
          </div>
        </div>
      
        <div className="text-sm space-y-1">
          {selectedTower.damage > 0 && (
            <div className="flex justify-between">
              <span>Damage:</span>
              <span>{selectedTower.damage}</span>
            </div>
          )}
          
          {selectedTower.range > 0 && (
            <div className="flex justify-between">
              <span>Range:</span>
              <span>{selectedTower.range} cells</span>
            </div>
          )}
          
          {selectedTower.attackSpeed > 0 && (
            <div className="flex justify-between">
              <span>Attack speed:</span>
              <span>{selectedTower.attackSpeed.toFixed(1)}/sec</span>
            </div>
          )}
          
          {selectedTower.goldProductionRate && (
            <div className="flex justify-between">
              <span>Gold production:</span>
              <span>{selectedTower.goldProductionRate}/2sec</span>
            </div>
          )}
          
          {selectedTower.buffRadius && selectedTower.buffRadius > 0 && (
            <div className="flex flex-col gap-1 border-t border-gray-300 pt-1 mt-1">
              <div className="flex justify-between">
                <span>Buff radius:</span>
                <span>{selectedTower.buffRadius} cells</span>
              </div>
              {getBuffDescription(selectedTower.type) && (
                <div className="text-xs text-gray-600">{getBuffDescription(selectedTower.type)}</div>
              )}
            </div>
          )}
          
          <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
            <span>Sell value:</span>
            <span>{selectedTower.sellValue} 💰</span>
          </div>
        </div>
        
        <div className="mt-3 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleUpgradeTower}
                  disabled={!canAffordUpgrade}
                  variant="default"
                  className={`
                    flex-1 text-xs py-1
                    ${!canAffordUpgrade ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  Upgrade ({selectedTower.upgradeCost} 💰)
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canAffordUpgrade 
                  ? 'Upgrade your tower to increase its power!'
                  : 'Not enough gold to upgrade this tower'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSellTower}
                  variant="destructive"
                  className="flex-1 text-xs py-1"
                >
                  Sell
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Sell this tower for {selectedTower.sellValue} gold
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TowerDetails;

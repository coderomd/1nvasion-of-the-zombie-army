
import React from 'react';
import { useGame } from '../GameContext';
import { CELL_SIZE, GRID_SIZE } from '../constants';
import Tower from './Tower';
import Enemy from './Enemy';
import GoldIndicator from './GoldIndicator';

const GameMap: React.FC = () => {
  const { state, placeTower } = useGame();
  const { grid, enemies, selectedTowerType, goldIndicators } = state;
  
  const handleCellClick = (x: number, y: number) => {
    // Only allow placing towers if a tower type is selected
    if (selectedTowerType) {
      placeTower(x, y);
    }
  };
  
  return (
    <div 
      className="game-map relative rounded-lg overflow-hidden shadow-lg td-map"
      style={{ 
        width: CELL_SIZE * GRID_SIZE, 
        height: CELL_SIZE * GRID_SIZE 
      }}
    >
      {/* Render grid */}
      {grid.map((row, y) => 
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`absolute border border-game-green-moss/30 cursor-pointer
              ${cell.isPath ? 'path-cell' : 'bg-game-green-grass/40'}
              ${!cell.isPath && !cell.hasTower && selectedTowerType ? 'hover:bg-game-green-grass/60' : ''}
              ${cell.hasTower ? 'cursor-default' : ''}`}
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
            onClick={() => !cell.hasTower && !cell.isPath ? handleCellClick(x, y) : undefined}
          />
        ))
      )}
      
      {/* Render towers */}
      {state.towers.map(tower => (
        <Tower key={tower.id} tower={tower} />
      ))}
      
      {/* Render enemies */}
      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
      
      {/* Render gold indicators */}
      {goldIndicators.map(indicator => (
        <GoldIndicator key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
};

export default GameMap;


import React from 'react';
import { useGame } from '../GameContext';
import { CELL_SIZE, GRID_SIZE } from '../constants';
import { GridCell } from '../types';
import TowerComponent from './Tower';
import EnemyComponent from './Enemy';

const GameMap: React.FC = () => {
  const { state, placeTower, selectTower } = useGame();
  const { grid, selectedTowerType } = state;

  const handleCellClick = (cell: GridCell) => {
    if (selectedTowerType && !cell.isPath && !cell.hasTower) {
      placeTower(cell.x, cell.y);
    } else if (cell.hasTower && cell.tower) {
      selectTower(cell.tower);
    }
  };

  return (
    <div 
      className="td-map relative overflow-hidden rounded-lg shadow-lg border-4 border-game-wood-dark"
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE
      }}
    >
      {/* Grid cells */}
      <div className="absolute inset-0 grid" style={{ 
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
      }}>
        {grid.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`cell-${x}-${y}`}
              className={`grid-cell ${cell.isPath ? 'path-cell' : !cell.hasTower ? 'grid-cell-buildable' : ''}`}
              onClick={() => handleCellClick(cell)}
            >
              {cell.hasTower && cell.tower && (
                <TowerComponent tower={cell.tower} />
              )}
            </div>
          ))
        )}
      </div>

      {/* Enemies */}
      {state.enemies.map(enemy => (
        <EnemyComponent key={enemy.id} enemy={enemy} />
      ))}

      {/* King's Tower at the end of the path */}
      {state.path.length > 0 && (
        <div 
          className="absolute z-10 flex items-center justify-center"
          style={{
            width: CELL_SIZE * 1.2,
            height: CELL_SIZE * 1.2,
            left: state.path[state.path.length - 1].x * CELL_SIZE - CELL_SIZE * 0.1,
            top: state.path[state.path.length - 1].y * CELL_SIZE - CELL_SIZE * 0.1,
          }}
        >
          <div className="w-full h-full bg-game-wood-dark rounded-md flex items-center justify-center">
            <div className="text-game-gold-light text-xs font-bold">KING</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMap;

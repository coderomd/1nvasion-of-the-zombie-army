import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameState, Tower, TowerType, Enemy, EnemyType, GridCell, PathPoint, Wave } from './types';
import { 
  GRID_SIZE, 
  CELL_SIZE, 
  TOWER_BASE_STATS, 
  ENEMY_BASE_STATS,
  INITIAL_GAME_STATE,
  GAME_PATH,
  UPGRADE_MULTIPLIERS,
  WAVE_DEFINITIONS,
  EXTRA_LIFE_BASE_COST,
  EXTRA_LIFE_COST_MULTIPLIER
} from './constants';

// Define action types
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'SELECT_TOWER_TYPE', payload: TowerType | null }
  | { type: 'SELECT_TOWER', payload: Tower | null }
  | { type: 'PLACE_TOWER', payload: { x: number; y: number } }
  | { type: 'UPGRADE_TOWER', payload: Tower }
  | { type: 'SELL_TOWER', payload: Tower }
  | { type: 'UPDATE_ENEMIES' }
  | { type: 'START_WAVE' }
  | { type: 'ENEMY_REACHED_END', payload: Enemy }
  | { type: 'ENEMY_KILLED', payload: Enemy }
  | { type: 'SPAWN_ENEMY' }
  | { type: 'BUY_LIFE' };

// Initialize grid with path
const initializeGrid = (): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  // Create empty grid
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({ 
        x, 
        y, 
        isPath: false, 
        hasTower: false 
      });
    }
    grid.push(row);
  }
  
  // Mark path cells
  GAME_PATH.forEach(point => {
    if (point.x >= 0 && point.x < GRID_SIZE && point.y >= 0 && point.y < GRID_SIZE) {
      grid[point.y][point.x].isPath = true;
    }
  });
  
  return grid;
};

// Create initial state
const initialState: GameState = {
  grid: initializeGrid(),
  path: GAME_PATH,
  towers: [],
  enemies: [],
  gold: INITIAL_GAME_STATE.gold,
  lives: INITIAL_GAME_STATE.lives,
  wave: { ...WAVE_DEFINITIONS[0] },
  gameStatus: 'notStarted',
  selectedTowerType: null,
  selectedTower: null,
  waveNumber: INITIAL_GAME_STATE.waveNumber,
  totalWaves: INITIAL_GAME_STATE.totalWaves,
  lastEnemySpawnTime: 0,
  enemiesSpawned: 0,
};

// Helper function to create a new enemy
const createEnemy = (type: EnemyType): Enemy => {
  const stats = ENEMY_BASE_STATS[type];
  return {
    id: uuidv4(),
    type,
    health: stats.health,
    maxHealth: stats.health,
    speed: stats.speed,
    position: { ...GAME_PATH[0] }, // Start at the first path point
    pathIndex: 0,
    goldReward: stats.goldReward,
    damage: stats.damage,
    progress: 0, // Progress between current and next path point (0-1)
  };
};

// Game logic reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStatus: 'running',
        lastEnemySpawnTime: Date.now(),
      };
      
    case 'PAUSE_GAME':
      return {
        ...state,
        gameStatus: 'paused',
      };
      
    case 'RESUME_GAME':
      return {
        ...state,
        gameStatus: 'running',
        lastEnemySpawnTime: Date.now(),
      };
      
    case 'SELECT_TOWER_TYPE':
      return {
        ...state,
        selectedTowerType: action.payload,
        selectedTower: null,
      };
      
    case 'SELECT_TOWER':
      return {
        ...state,
        selectedTower: action.payload,
        selectedTowerType: null,
      };
      
    case 'PLACE_TOWER': {
      const { x, y } = action.payload;
      const cell = state.grid[y][x];
      
      if (cell.isPath || cell.hasTower || !state.selectedTowerType) {
        return state;
      }
      
      const towerBaseStats = TOWER_BASE_STATS[state.selectedTowerType];
      const towerCost = towerBaseStats.cost;
      
      if (state.gold < towerCost) {
        return state;
      }
      
      // Create a new tower
      const newTower: Tower = {
        id: uuidv4(),
        type: state.selectedTowerType,
        position: { x, y },
        level: 1,
        damage: towerBaseStats.damage,
        range: towerBaseStats.range,
        attackSpeed: towerBaseStats.attackSpeed,
        lastAttackTime: 0,
        cost: towerCost,
        sellValue: Math.floor(towerCost * 0.7),
        upgradeCost: towerBaseStats.upgradeCost,
        targets: [],
        areaEffect: towerBaseStats.areaEffect,
        buffRadius: towerBaseStats.buffRadius,
        goldProductionRate: towerBaseStats.goldProductionRate,
        lastGoldTime: Date.now(),
      };
      
      // Update the grid
      const newGrid = [...state.grid];
      newGrid[y][x] = { ...newGrid[y][x], hasTower: true, tower: newTower };
      
      return {
        ...state,
        grid: newGrid,
        towers: [...state.towers, newTower],
        gold: state.gold - towerCost,
        selectedTowerType: null,
      };
    }
    
    case 'UPGRADE_TOWER': {
      const tower = action.payload;
      if (state.gold < tower.upgradeCost) {
        return state;
      }
      
      // Apply upgrade multipliers
      const upgradeMultiplier = UPGRADE_MULTIPLIERS;
      const upgradedTower: Tower = {
        ...tower,
        level: tower.level + 1,
        damage: Math.round(tower.damage * upgradeMultiplier.damage),
        range: Math.round((tower.range * upgradeMultiplier.range) * 10) / 10,
        attackSpeed: Math.round((tower.attackSpeed * upgradeMultiplier.attackSpeed) * 10) / 10,
        upgradeCost: Math.round(tower.upgradeCost * upgradeMultiplier.upgradeCost),
        sellValue: Math.floor((tower.cost + tower.upgradeCost) * 0.7),
      };
      
      if (tower.goldProductionRate) {
        upgradedTower.goldProductionRate = Math.round(tower.goldProductionRate * upgradeMultiplier.goldProductionRate);
      }
      
      // Update the tower in state
      const newTowers = state.towers.map(t => 
        t.id === tower.id ? upgradedTower : t
      );
      
      // Update the tower in the grid
      const newGrid = [...state.grid];
      newGrid[tower.position.y][tower.position.x] = {
        ...newGrid[tower.position.y][tower.position.x],
        tower: upgradedTower
      };
      
      return {
        ...state,
        towers: newTowers,
        grid: newGrid,
        gold: state.gold - tower.upgradeCost,
        selectedTower: upgradedTower,
      };
    }
    
    case 'SELL_TOWER': {
      const tower = action.payload;
      
      // Remove tower from grid
      const newGrid = [...state.grid];
      newGrid[tower.position.y][tower.position.x] = {
        ...newGrid[tower.position.y][tower.position.x],
        hasTower: false,
        tower: undefined,
      };
      
      // Remove tower from towers list
      const newTowers = state.towers.filter(t => t.id !== tower.id);
      
      return {
        ...state,
        grid: newGrid,
        towers: newTowers,
        gold: state.gold + tower.sellValue,
        selectedTower: null,
      };
    }
    
    case 'SPAWN_ENEMY': {
      // Check if we've spawned all enemies for this wave
      if (state.enemiesSpawned >= state.wave.count) {
        return {
          ...state,
          wave: {
            ...state.wave,
            completed: true,
          }
        };
      }
      
      // Create a new enemy based on the wave definition
      const enemyType = state.wave.enemies[state.enemiesSpawned % state.wave.enemies.length];
      const newEnemy = createEnemy(enemyType);
      
      return {
        ...state,
        enemies: [...state.enemies, newEnemy],
        enemiesSpawned: state.enemiesSpawned + 1,
        lastEnemySpawnTime: Date.now(),
      };
    }
    
    case 'UPDATE_ENEMIES': {
      // This will be called by the game loop to update enemy positions
      if (state.gameStatus !== 'running') {
        return state;
      }
      
      // Check if wave is complete and all enemies are dead
      if (state.wave.completed && state.enemies.length === 0) {
        // Start next wave if available
        const nextWaveNumber = state.waveNumber + 1;
        if (nextWaveNumber <= state.totalWaves) {
          return {
            ...state,
            waveNumber: nextWaveNumber,
            wave: { ...WAVE_DEFINITIONS[nextWaveNumber - 1] },
            enemiesSpawned: 0,
            lastEnemySpawnTime: Date.now(),
          };
        } else {
          // Victory!
          return {
            ...state,
            gameStatus: 'victory',
          };
        }
      }
      
      // Move existing enemies along the path
      const now = Date.now();
      const newEnemies = state.enemies.map(enemy => {
        // Calculate how far the enemy should move
        const elapsedSeconds = 1/30; // We're running at 30 FPS
        const distanceToMove = enemy.speed * elapsedSeconds;
        
        // Update progress along current path segment
        let newProgress = enemy.progress + distanceToMove;
        let newPathIndex = enemy.pathIndex;
        
        // Check if enemy has reached the next path point
        while (newProgress >= 1 && newPathIndex < GAME_PATH.length - 1) {
          // Move to next path point
          newProgress -= 1;
          newPathIndex += 1;
        }
        
        // If enemy has reached the end of the path
        if (newPathIndex >= GAME_PATH.length - 1 && newProgress >= 1) {
          // This enemy has reached the end and should be removed
          // We'll handle this in a separate case to avoid modifying the array while iterating
          return {
            ...enemy,
            pathIndex: newPathIndex,
            progress: 1,
            reachedEnd: true,
          };
        }
        
        // Calculate the new position based on interpolation between path points
        const currentPoint = GAME_PATH[newPathIndex];
        let nextPoint = currentPoint;
        
        // Only interpolate if not at the last point
        if (newPathIndex < GAME_PATH.length - 1) {
          nextPoint = GAME_PATH[newPathIndex + 1];
        }
        
        // Interpolate between current point and next point
        const newX = currentPoint.x + (nextPoint.x - currentPoint.x) * newProgress;
        const newY = currentPoint.y + (nextPoint.y - currentPoint.y) * newProgress;
        
        return {
          ...enemy,
          pathIndex: newPathIndex,
          progress: newProgress,
          position: { x: newX, y: newY },
        };
      });
      
      // Handle enemies that reached the end
      const enemiesAtEnd = newEnemies.filter(e => e.reachedEnd);
      let updatedState = { ...state };
      
      // Process each enemy that reached the end
      for (const enemy of enemiesAtEnd) {
        const newLives = updatedState.lives - enemy.damage;
        
        if (newLives <= 0) {
          // Game over
          return {
            ...updatedState,
            enemies: newEnemies.filter(e => !e.reachedEnd),
            lives: 0,
            gameStatus: 'defeat',
          };
        }
        
        updatedState = {
          ...updatedState,
          lives: newLives,
        };
      }
      
      // Process tower attacks
      const enemiesAfterTowerAttacks = newEnemies
        .filter(e => !e.reachedEnd)
        .map(enemy => {
          let updatedEnemy = { ...enemy };
          
          // Check each tower for attacks
          for (const tower of state.towers) {
            // Skip if tower can't attack yet
            if (now - tower.lastAttackTime < 1000 / tower.attackSpeed) {
              continue;
            }
            
            // Check if enemy is in range
            const dx = tower.position.x - enemy.position.x;
            const dy = tower.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= tower.range) {
              // Tower attacks this enemy
              updatedEnemy.health -= tower.damage;
              
              // Update tower's last attack time and trigger animation
              const towerIndex = state.towers.findIndex(t => t.id === tower.id);
              if (towerIndex !== -1) {
                state.towers[towerIndex] = {
                  ...tower,
                  lastAttackTime: now,
                  isAttacking: true,
                  attackAnimationEnd: now + 300, // Animation duration in ms
                };
              }
              
              // If tower has area effect, we would damage other enemies here
              break; // Tower can only attack one enemy per cycle
            }
          }
          
          return updatedEnemy;
        });
      
      // Reset attack animation states that have finished
      const updatedTowers = state.towers.map(tower => {
        if (tower.isAttacking && tower.attackAnimationEnd && tower.attackAnimationEnd <= now) {
          return {
            ...tower,
            isAttacking: false,
          };
        }
        
        // Process gold miners production
        if (tower.goldProductionRate && tower.lastGoldTime) {
          const goldElapsedTime = now - tower.lastGoldTime;
          // Gold miners produce every 5 seconds
          if (goldElapsedTime >= 5000) {
            return {
              ...tower,
              lastGoldTime: now,
              isAttacking: true, // Show animation for gold production too
              attackAnimationEnd: now + 300,
            };
          }
        }
        return tower;
      });
      
      // Process killed enemies
      const killedEnemies = enemiesAfterTowerAttacks.filter(e => e.health <= 0);
      const survivingEnemies = enemiesAfterTowerAttacks.filter(e => e.health > 0);
      
      // Calculate gold from killed enemies
      const goldFromKills = killedEnemies.reduce((total, enemy) => total + enemy.goldReward, 0);
      
      return {
        ...updatedState,
        enemies: survivingEnemies,
        towers: updatedTowers,
        gold: updatedState.gold + goldFromKills,
      };
    }
    
    case 'START_WAVE': {
      // Start the next wave
      return {
        ...state,
        gameStatus: 'running',
        lastEnemySpawnTime: Date.now(),
      };
    }
    
    case 'ENEMY_REACHED_END': {
      // Handled in UPDATE_ENEMIES action now
      return state;
    }
    
    case 'ENEMY_KILLED': {
      // Handled in UPDATE_ENEMIES action now
      return state;
    }
    
    case 'BUY_LIFE': {
      const lifeCost = Math.round(EXTRA_LIFE_BASE_COST * Math.pow(EXTRA_LIFE_COST_MULTIPLIER, state.lives - INITIAL_GAME_STATE.lives));
      
      if (state.gold < lifeCost) {
        return state;
      }
      
      return {
        ...state,
        gold: state.gold - lifeCost,
        lives: state.lives + 1,
      };
    }
    
    default:
      return state;
  }
};

// Create the context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  selectTowerType: (type: TowerType | null) => void;
  selectTower: (tower: Tower | null) => void;
  placeTower: (x: number, y: number) => void;
  upgradeTower: (tower: Tower) => void;
  sellTower: (tower: Tower) => void;
  startWave: () => void;
  buyLife: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Convenience actions
  const startGame = () => dispatch({ type: 'START_GAME' });
  const pauseGame = () => dispatch({ type: 'PAUSE_GAME' });
  const resumeGame = () => dispatch({ type: 'RESUME_GAME' });
  const selectTowerType = (type: TowerType | null) => dispatch({ type: 'SELECT_TOWER_TYPE', payload: type });
  const selectTower = (tower: Tower | null) => dispatch({ type: 'SELECT_TOWER', payload: tower });
  const placeTower = (x: number, y: number) => dispatch({ type: 'PLACE_TOWER', payload: { x, y } });
  const upgradeTower = (tower: Tower) => dispatch({ type: 'UPGRADE_TOWER', payload: tower });
  const sellTower = (tower: Tower) => dispatch({ type: 'SELL_TOWER', payload: tower });
  const startWave = () => dispatch({ type: 'START_WAVE' });
  const buyLife = () => dispatch({ type: 'BUY_LIFE' });
  
  // Update function for game loop
  useEffect(() => {
    if (state.gameStatus !== 'running') return;
    
    const gameLoop = setInterval(() => {
      // Check if it's time to spawn a new enemy
      const now = Date.now();
      const timeSinceLastSpawn = now - state.lastEnemySpawnTime;
      const spawnInterval = 1000 / state.wave.spawnRate;
      
      if (!state.wave.completed && timeSinceLastSpawn >= spawnInterval) {
        dispatch({ type: 'SPAWN_ENEMY' });
      }
      
      // Update enemies (movement, etc.)
      dispatch({ type: 'UPDATE_ENEMIES' });
      
    }, 1000 / 30); // 30fps
    
    return () => clearInterval(gameLoop);
  }, [state.gameStatus, state.lastEnemySpawnTime, state.wave]);
  
  // Provide context value
  const contextValue: GameContextType = {
    state,
    dispatch,
    startGame,
    pauseGame,
    resumeGame,
    selectTowerType,
    selectTower,
    placeTower,
    upgradeTower,
    sellTower,
    startWave,
    buyLife,
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

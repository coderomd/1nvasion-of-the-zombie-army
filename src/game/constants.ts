
import { TowerType, EnemyType } from './types';

export const GRID_SIZE = 10;
export const CELL_SIZE = 40; // pixels

export const TOWER_BASE_STATS = {
  [TowerType.KNIGHT]: {
    damage: 10, // Reduced from 15
    range: 1,
    attackSpeed: 1,
    cost: 100,
    upgradeCost: 75,
    areaEffect: false,
    buffRadius: 0,
    goldProductionRate: 0,
  },
  [TowerType.ARCHER]: {
    damage: 6, // Reduced from 8
    range: 3,
    attackSpeed: 1.5,
    cost: 75,
    upgradeCost: 50,
    areaEffect: false,
    buffRadius: 0,
    goldProductionRate: 0,
  },
  [TowerType.CANNON]: {
    damage: 18, // Reduced from 25
    range: 2,
    attackSpeed: 0.5,
    cost: 150,
    upgradeCost: 100,
    areaEffect: true,
    buffRadius: 0,
    goldProductionRate: 0,
  },
  [TowerType.GOLD_MINER]: {
    damage: 0,
    range: 0,
    attackSpeed: 0,
    cost: 200,
    upgradeCost: 150,
    areaEffect: false,
    buffRadius: 0,
    goldProductionRate: 10, // gold per 2 seconds (changed from 5 seconds)
  },
  [TowerType.BLACKSMITH]: {
    damage: 5, // Added basic attack capability
    range: 1, // Short range
    attackSpeed: 0.7, // Slower attack speed
    cost: 125,
    upgradeCost: 100,
    areaEffect: false,
    buffRadius: 2, // affects knights and miners in radius of 2 cells
    goldProductionRate: 0,
  },
};

export const ENEMY_BASE_STATS = {
  [EnemyType.BASIC_ZOMBIE]: {
    health: 175, // Reduced by 12.5% from 200
    speed: 0.5, // cells per second
    goldReward: 10,
    damage: 1, // damage to player's lives
  },
  [EnemyType.FAST_ZOMBIE]: {
    health: 105, // Reduced by 12.5% from 120
    speed: 1,
    goldReward: 15,
    damage: 1,
  },
  [EnemyType.ARMORED_ZOMBIE]: {
    health: 350, // Reduced by 12.5% from 400
    speed: 0.3,
    goldReward: 20,
    damage: 2,
  },
  [EnemyType.SPITTER_ZOMBIE]: {
    health: 140, // Reduced by 12.5% from 160
    speed: 0.6,
    goldReward: 15,
    damage: 1,
  },
};

export const INITIAL_GAME_STATE = {
  gold: 250,
  lives: 100,
  waveNumber: 0,
  totalWaves: 10,
};

// Define the game path - this will be a winding path from left to right
export const GAME_PATH = [
  { x: 0, y: 3 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 3, y: 4 },
  { x: 3, y: 5 },
  { x: 3, y: 6 },
  { x: 4, y: 6 },
  { x: 5, y: 6 },
  { x: 6, y: 6 },
  { x: 6, y: 5 },
  { x: 6, y: 4 },
  { x: 6, y: 3 },
  { x: 6, y: 2 },
  { x: 7, y: 2 },
  { x: 8, y: 2 },
  { x: 9, y: 2 },
];

export const UPGRADE_MULTIPLIERS = {
  damage: 1.5,
  range: 1.05, // Reduced from 1.1 to make range increases even smaller
  attackSpeed: 1.2,
  upgradeCost: 1.5,
  goldProductionRate: 1.5,
};

export const EXTRA_LIFE_BASE_COST = 100;
export const EXTRA_LIFE_COST_MULTIPLIER = 1.25;

export const WAVE_DEFINITIONS = Array.from({ length: 10 }, (_, i) => {
  const waveNumber = i + 1;
  let enemies: EnemyType[] = [];
  
  // Add basic zombies to all waves
  enemies = Array(Math.floor(waveNumber * 2)).fill(EnemyType.BASIC_ZOMBIE);
  
  // Add fast zombies from wave 3
  if (waveNumber >= 3) {
    enemies = [...enemies, ...Array(Math.floor(waveNumber / 2)).fill(EnemyType.FAST_ZOMBIE)];
  }
  
  // Add armored zombies from wave 5
  if (waveNumber >= 5) {
    enemies = [...enemies, ...Array(Math.floor(waveNumber / 3)).fill(EnemyType.ARMORED_ZOMBIE)];
  }
  
  // Add spitter zombies from wave 7
  if (waveNumber >= 7) {
    enemies = [...enemies, ...Array(Math.floor(waveNumber / 4)).fill(EnemyType.SPITTER_ZOMBIE)];
  }
  
  return {
    number: waveNumber,
    enemies,
    count: enemies.length,
    spawnRate: 0.5 + (waveNumber * 0.1), // enemies per second increases with wave number
    spawnDelay: 5, // 5 seconds before wave starts
    completed: false,
  };
});

export const WAVE_COMPLETION_REWARDS = {
  BASE_GOLD: 50,  // Base gold for completing a wave
  PER_LIFE_BONUS: 2,  // Gold per each life remaining
  PER_TOWER_BONUS: 5,  // Gold per tower built
};

export const TOWER_DESCRIPTIONS = {
  [TowerType.KNIGHT]: "Knights are melee blockers that deal medium damage to enemies passing by. They can be buffed by nearby Blacksmiths.",
  [TowerType.ARCHER]: "Archers attack from afar with fast arrows that deal low damage. They're inexpensive but effective.",
  [TowerType.CANNON]: "Cannons deliver high damage with area splash effect. Slow to reload but devastating when fired.",
  [TowerType.GOLD_MINER]: "Gold Miners generate gold every 2 seconds to fund your defenses. Nearby Blacksmiths increase their production.",
  [TowerType.BLACKSMITH]: "Blacksmiths buff nearby Knights and Gold Miners. They also have a basic attack capability."
};


export type GridCell = {
  x: number;
  y: number;
  isPath: boolean;
  hasTower: boolean;
  tower?: Tower;
};

export type GridPosition = {
  x: number;
  y: number;
};

export type PathPoint = GridPosition;

export enum TowerType {
  KNIGHT = 'knight',
  ARCHER = 'archer',
  CANNON = 'cannon',
  GOLD_MINER = 'goldMiner',
  BLACKSMITH = 'blacksmith'
}

export type Tower = {
  id: string;
  type: TowerType;
  position: GridPosition;
  level: number;
  damage: number;
  range: number;
  attackSpeed: number; // attacks per second
  lastAttackTime: number;
  cost: number;
  sellValue: number;
  upgradeCost: number;
  targets: Enemy[];
  areaEffect?: boolean;
  buffRadius?: number;
  goldProductionRate?: number;
  lastGoldTime?: number;
};

export enum EnemyType {
  BASIC_ZOMBIE = 'basicZombie',
  FAST_ZOMBIE = 'fastZombie',
  ARMORED_ZOMBIE = 'armoredZombie',
  SPITTER_ZOMBIE = 'spitterZombie'
}

export type Enemy = {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number; // cells per second
  position: { x: number, y: number };
  pathIndex: number;
  goldReward: number;
  damage: number; // damage to player's lives
  progress: number; // progress between current path point and next (0-1)
  reachedEnd?: boolean; // flag to track if enemy reached the end
};

export type Wave = {
  number: number;
  enemies: EnemyType[];
  count: number;
  spawnRate: number; // enemies per second
  spawnDelay: number; // seconds before wave starts
  completed: boolean;
};

export type GameState = {
  grid: GridCell[][];
  path: PathPoint[];
  towers: Tower[];
  enemies: Enemy[];
  gold: number;
  lives: number;
  wave: Wave;
  gameStatus: 'notStarted' | 'running' | 'paused' | 'victory' | 'defeat';
  selectedTowerType: TowerType | null;
  selectedTower: Tower | null;
  waveNumber: number;
  totalWaves: number;
  lastEnemySpawnTime: number; // timestamp of last enemy spawn
  enemiesSpawned: number; // count of enemies spawned in current wave
};

export type Direction = 'Up' | 'Down' | 'Left' | 'Right';

export interface IEnemyAnimation {
  spritePath: string;
  frames: number;
  frameWidth: number;
  frameHeight: number;
  frameSpeed: number;
  loop?: boolean;
}

export interface IEnemyAnimations {
  Idle?: IEnemyAnimation;
  Walk?: IEnemyAnimation;
  Run?: IEnemyAnimation;
  Attack?: IEnemyAnimation;
  Death?: IEnemyAnimation;
  GetDamage?: IEnemyAnimation;
}

export interface IEnemy {

  x: number;
  y: number;
  row: number;
  col: number;
  direction: Direction;
  speed: number;
  color: string;

  name?: string;
  health?: number;
  damage?: number;
  visionRange?: number;
  armor: number


  image?: HTMLImageElement;
  currentAnimation?: keyof IEnemyAnimations;
  frameIndex?: number;
  lastFrameTime?: number;

  biome: 'Spooky Dungeon' | 'Emerald Woods' | 'Glassy Forest'

  animations?: IEnemyAnimations;

  spriteScale?: number;
  directional?: boolean;

  hitbox?: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  };

}

export const SkeletonEnemy: IEnemy = {
  name: 'Skeleton Warrior',
  biome: 'Spooky Dungeon',
  x: 150,
  y: 200,
  row: 5,
  col: 3,
  direction: 'Down',
  speed: 1.1,
  color: '#cccccc',
  health: 60,
  damage: 10,
  visionRange: 220,
  armor: 10,

  spriteScale: 2,
  directional: false,

  hitbox: {
    width: 40,
    height: 50,
    offsetX: -20,  // центр спрайта
    offsetY: -40   // зсунуто до ніг
  },

  animations: {
    Idle: {
      spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Idle.png',
      frames: 8,
      frameWidth: 96,
      frameHeight: 64,
      frameSpeed: 200,
      loop: true
    },
    Walk: {
      spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Walk.png',
      frames: 8,
      frameWidth: 96,
      frameHeight: 64,
      frameSpeed: 120,
      loop: true
    },
    Attack: {
      spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Attack1.png',
      frames: 8,
      frameWidth: 96,
      frameHeight: 64,
      frameSpeed: 100
    },
    GetDamage: {
      spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Hurt.png',
      frames: 4,
      frameWidth: 96,
      frameHeight: 64,
      frameSpeed: 150
    },
    Death: {
      spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Die.png',
      frames: 6,
      frameWidth: 96,
      frameHeight: 64,
      frameSpeed: 150
    }
  }
};


export const MushroomEnemy: IEnemy = {
  name: 'Angry Mushroom',
  biome: 'Emerald Woods',
  x: 150,
  y: 200,
  row: 5,
  col: 3,
  direction: 'Down',
  speed: 1.1,
  color: '#cccccc',
  health: 60,
  damage: 10,
  visionRange: 220,
  armor: 10,

  spriteScale: 2,
  directional: false,

  hitbox: {
    width: 45,
    height: 40,
    offsetX: -22,
    offsetY: -35
  },

  animations: {
    Idle: {
      spritePath: 'assets/enemies/mushroom/Mushroom-Idle.png',
      frames: 8,
      frameWidth: 80,
      frameHeight: 64,
      frameSpeed: 200,
      loop: true
    },
    Walk: {
      spritePath: 'assets/enemies/mushroom/Mushroom-Run.png',
      frames: 8,
      frameWidth: 80,
      frameHeight: 64,
      frameSpeed: 120,
      loop: true
    },
    Attack: {
      spritePath: 'assets/enemies/mushroom/Mushroom-Attack.png',
      frames: 8,
      frameWidth: 80,
      frameHeight: 64,
      frameSpeed: 100
    },
    GetDamage: {
      spritePath: 'assets/enemies/mushroom/Mushroom-Hit.png',
      frames: 4,
      frameWidth: 80,
      frameHeight: 64,
      frameSpeed: 150
    },
    Death: {
      spritePath: 'assets/enemies/mushroom/Mushroom-Die.png',
      frames: 6,
      frameWidth: 80,
      frameHeight: 64,
      frameSpeed: 150
    }
  }
};


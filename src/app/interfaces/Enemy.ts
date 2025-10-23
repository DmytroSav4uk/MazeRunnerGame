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

  id?: string;
  name?: string;
  health?: number;
  damage?: number;
  visionRange?: number;
  attackRange?: number;


  image?: HTMLImageElement;
  currentAnimation?: keyof IEnemyAnimations;
  frameIndex?: number;
  lastFrameTime?: number;

  biome: 'Spooky Dungeon' | 'Emerald Woods' | 'Glassy Forest'

  animations?: IEnemyAnimations;

  spriteScale?: number;
  directional?: boolean;
}


export const SkeletonEnemy: IEnemy = {
  id: 'enemy_skeleton_white',
  name: 'Skeleton Warrior',
  biome:'Spooky Dungeon',
  x: 150,
  y: 200,
  row: 5,
  col: 3,
  direction: 'Down',
  speed: 1.1,
  color: '#cccccc',
  health: 70,
  damage: 10,
  visionRange: 220,
  attackRange: 40,
  spriteScale: 2,
  directional: false,

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
    // Attack2: {
    //   spritePath: 'assets/enemies/skeleton/Skeleton_01_White_Attack2.png',
    //   frames: 8,
    //   frameWidth: 64,
    //   frameHeight: 96,
    //   frameSpeed: 100
    // },
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

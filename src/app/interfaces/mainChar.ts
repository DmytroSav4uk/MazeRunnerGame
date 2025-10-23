export type Direction = 'Up' | 'Down' | 'Left' | 'Right';

export interface IAnimationFrames {
  startX: number;
  startY: number;
  frames: number;
  frameWidth: number;
  frameHeight: number;
  frameSpeed: number;
}

export interface ICharacterAnimations {
  Idle?: Record<Direction, IAnimationFrames>;
  Walk?: Record<Direction, IAnimationFrames>;
  Run?: Record<Direction, IAnimationFrames>;
  Attack?:Record<Direction, IAnimationFrames>;
  Death?:Record<Direction, IAnimationFrames>;
  GetDamage?:Record<Direction, IAnimationFrames>;
}

export interface IMainChar {
  name: string;
  health:number
  maxHealth:number
  damage:number
  spritePath: string;
  animations: ICharacterAnimations;
}

export const MainChar: IMainChar = {
  name: 'Hero',
  health:50,
  maxHealth:50,
  damage:20,
  spritePath: 'assets/characters/mainCharSheet.png',
  animations: {
    Walk: {
      Right: { startX: 1, startY: 65, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 1, startY: 65, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 1, startY: 65, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 1, startY: 65, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    },
    Idle: {
      Right: { startX: 1, startY: 1, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Left:  { startX: 1, startY: 1, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Up:    { startX: 1, startY: 1, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Down:  { startX: 1, startY: 1, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 }
    },
    Run: {
      Right: { startX: 0, startY: 97, frames: 7, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 0, startY: 97, frames: 7, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 0, startY: 97, frames: 7, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 0, startY: 97, frames: 7, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    },

    Attack: {
      Right: { startX: 0, startY: 289, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 0, startY: 289, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 0, startY: 289, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 0, startY: 289, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    },
    GetDamage: {
      Right: { startX: 0, startY: 257, frames: 3, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 0, startY: 257, frames: 3, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 0, startY: 257, frames: 3, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 0, startY: 257, frames: 3, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    },
    Death: {
      Right: { startX: 0, startY: 257, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 0, startY: 257, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 0, startY: 257, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 0, startY: 257, frames: 8, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    }
  }
};

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
}

export interface IMainChar {
  name: string;
  spritePath: string;
  animations: ICharacterAnimations;
}


export const MainChar: IMainChar = {
  name: 'Hero',
  spritePath: 'assets/characters/mainCharSheet.png',
  animations: {
    Walk: {
      Right: { startX: 0, startY: 64, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Left:  { startX: 0, startY: 64, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Up:    { startX: 0, startY: 64, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 },
      Down:  { startX: 0, startY: 64, frames: 4, frameWidth: 32, frameHeight: 32, frameSpeed: 100 }
    },
    Idle: {
      Right: { startX: 0, startY: 0, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Left:  { startX: 0, startY: 0, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Up:    { startX: 0, startY: 0, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 },
      Down:  { startX: 0, startY: 0, frames: 2, frameWidth: 32, frameHeight: 32, frameSpeed: 500 }
    }
  }
};

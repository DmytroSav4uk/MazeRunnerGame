import { IItem } from './Item';

export interface IFrame {
  x: number;
  y: number;
}

export interface IChestAnimationFrames {
  frames: IFrame[];
  frameWidth: number;
  frameHeight: number;
  frameSpeed: number;
}

export interface IChestAnimations {
  Closed: IChestAnimationFrames;
  Open: IChestAnimationFrames;
}

export interface IChest {
  itemInside: IItem;
  isOpen: boolean;
  animations: IChestAnimations;
  sprite: HTMLImageElement;


  row: number;
  col: number;
  frameIndex?: number;
  lastFrameTime?: number;
}



const chestSprite = new Image();
chestSprite.src = 'assets/mazeLevel/shared/chests.png';

export const Chest: IChest = {
  itemInside: {} as IItem,
  isOpen: false,
  sprite: chestSprite,
  animations: {
    Closed: {
      frames: [{ x: 0, y: 0 }],
      frameWidth: 48,
      frameHeight: 32,
      frameSpeed: 500
    },
    Open: {
      frames: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 }
      ],
      frameWidth: 48,
      frameHeight: 32,
      frameSpeed: 100
    }
  },
  row: 0,
  col: 0,
  frameIndex: 0,
  lastFrameTime: 0
};

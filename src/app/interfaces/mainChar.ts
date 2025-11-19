import {IItem} from './Item';

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

export interface IInventorySlot {
  item: IItem;
  quantity: number;
}

export interface IInventory {
  items: IInventorySlot[];

  addItem: (item: IItem, amount?: number) => void;
  useItem: (index: number, player: IMainChar) => void;
  removeItem: (index: number) => void;
}

export interface IMainChar {
  name: string;
  health:number
  baseHealth:number
  maxHealth:number
  damage:number
  baseDamage:number
  armor:number
  baseArmor:number
  spritePath: string;
  animations: ICharacterAnimations;
  inventory:IInventory;
  speed:number
}

export function createInventory(): IInventory {
  const items: IInventorySlot[] = [];

  return {
    items,

    addItem(item: IItem, amount: number = 1): void {
      if (item.stackable) {
        const existing = items.find(slot => slot.item.name === item.name);
        if (existing) {
          existing.quantity += amount;
          console.log(`📦 Added ${amount}x ${item.name} (Total: ${existing.quantity})`);
          return;
        }
      }
      items.push({ item, quantity: amount });
      console.log(`🎒 Added ${amount}x ${item.name}`);
    },

    useItem(index: number, player: IMainChar): void {
      const slot = items[index];
      if (!slot) {
        console.log('❌ No item in that slot!');
        return;
      }

      const item = slot.item;

      if (!item.usableInMaze && !item.usableInBattle) {
        console.log('🚫 Item cannot be used now.');
        return;
      }

      item.use(player);

      if (item.stackable) {
        slot.quantity -= 1;
        console.log(`🧪 Used ${item.name} (x${slot.quantity} left)`);
        if (slot.quantity <= 0) this.removeItem(index);
      } else {
        this.removeItem(index);
      }
    },

    removeItem(index: number): void {
      const removed = items.splice(index, 1)[0];
      if (removed) console.log(`🗑️ Removed ${removed.item.name}`);
    }
  };
}


export const MainChar: IMainChar = {
  name: 'Hero',
  health:50,
  baseHealth:50,
  maxHealth:50,
  damage:20,
  baseDamage:20,
  armor:10,
  baseArmor:10,
  speed:1.5,
  inventory: createInventory(),
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



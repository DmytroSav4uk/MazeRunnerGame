import {IBiome} from './Biome';
import {IChest} from './Chest';
import {IItem} from './Item';

export interface ISave {
  slot:string;
  level:number;
  maze:any;
  playerX:number;
  playerY:number;
  timestamp?: string;
  goalRow:any;
  goalCol:any;
  currentBiome:IBiome;
  nextLevelBiome:IBiome;

  chests: IChest[];
  playerState: {
    health: number;
    maxHealth: number;
    armor:number;
    damage:number;
    inventory: { item: IItem; quantity: number }[];
  };
}

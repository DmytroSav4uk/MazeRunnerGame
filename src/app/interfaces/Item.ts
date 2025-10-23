import {IMainChar} from './mainChar';

export interface IItem {
  name:string
  description:string
  use: (player: IMainChar) => void;
  usableInMaze:boolean
  usableInBattle:boolean
}


export const healingPotion: IItem = {
  name: 'Healing Potion',
  description: 'Heals 20 HP (cannot exceed max health).',
  usableInBattle: true,
  usableInMaze: true,

  use: (player: IMainChar) => {
    const healAmount = 20;
    const healed = Math.min(player.health + healAmount, player.maxHealth);
    const actualHeal = healed - player.health;
    player.health = healed;

    console.log(`💖 ${player.name} healed for ${actualHeal} HP (${player.health}/${player.maxHealth})`);
  }
};


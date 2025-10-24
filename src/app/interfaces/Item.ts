import {IMainChar} from './mainChar';

export interface IItem {
  name:string
  description:string
  stackable:boolean
  use: (player: IMainChar) => void;
  usableInMaze:boolean
  usableInBattle:boolean
}



export const healingPotion: IItem = {
  name: 'Healing Potion',
  description: 'Heals 20 HP (cannot exceed max health).',
  stackable:true,
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

export const WeaponUpgrade: IItem = {
  name: 'Weapon upgrade',
  description: 'Increases damage on 5',
  usableInMaze: true,
  usableInBattle: false,
  stackable: true,
  use(player: IMainChar) {
    player.damage += 5;
  }
};

export const ArmorUpgrade: IItem = {
  name: 'Armor upgrade',
  description: 'Increases armor on 1 (max armor is 20)',
  usableInMaze: true,
  usableInBattle: false,
  stackable: true,
  use(player: IMainChar) {
    if (player.armor < 20) {
      player.armor += 1;
    }
  }
};

export const HealthUpgrade: IItem = {
  name: 'Health upgrade',
  description: 'Increases max health on 5',
  usableInMaze: true,
  usableInBattle: false,
  stackable: true,
  use(player: IMainChar) {
    player.maxHealth += 5;
  }
};

export const UltraSpeedPotion: IItem = {
  name: 'Ultra speed potion',
  description: 'makes you so fast you can that tear through the matter but only for 5 seconds (do not use sprint button or potion will stop working)',
  usableInMaze: true,
  usableInBattle: false,
  stackable: true,
  use(player: IMainChar) {
    player.speed = 500;
    setTimeout(()=>{
      player.speed = 1.5
    },5000)
  }
};


export const ITEM_REGISTRY: Record<string, IItem> = {
  'Healing Potion': healingPotion,
  'Ultra Speed Potion': UltraSpeedPotion,
  'Weapon Upgrade': WeaponUpgrade,
  'Armor Upgrade': ArmorUpgrade,
  'Health Upgrade': HealthUpgrade,
};

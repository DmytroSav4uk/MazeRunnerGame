import {Routes} from '@angular/router';
import {StartMenu} from './components/menu/start-menu/start-menu';
import {Start} from './components/menu/start/start';
import {MainMenu} from './components/menu/main-menu/main-menu';
import {Credits} from './components/menu/credits/credits';
import {SaveSlots} from './components/menu/save-slots/save-slots';
import {Settings} from './components/menu/settings/settings';
import {MazeLevel} from './components/game/maze-level/maze-level';
import {BattleLevel} from './components/game/battle-level/battle-level';


export const routes: Routes = [
  {
    path: '', component: StartMenu, children: [
      {path: '', component: Start},
      {path: 'menu', component: MainMenu},
      {path: 'menu/credits', component: Credits},
      {path: 'menu/saves', component: SaveSlots},
      {path: 'menu/settings', component: Settings}
    ]
  },
  {
    path: 'maze', component: MazeLevel, children: [
      {path: 'saves', component: SaveSlots}
    ]
  },
  {path:'battle',component:BattleLevel}
];

import {Routes} from '@angular/router';
import {MainMenu} from './components/main-menu/main-menu';
import {Start} from './components/start/start';
import {StartMenu} from './components/start-menu/start-menu';
import {Credits} from './components/credits/credits';
import {MazeLevel} from './components/maze-level/maze-level';
import {SaveSlots} from './components/save-slots/save-slots';

export const routes: Routes = [
  {
    path: '', component: StartMenu, children: [
      {path: '', component: Start},
      {path: 'menu', component: MainMenu},
      {path: 'menu/credits', component: Credits},
      {path: 'menu/saves', component: SaveSlots}
    ]
  },
  {
    path: 'maze', component: MazeLevel, children: [
      {path: 'saves', component: SaveSlots}
    ]
  }
  // {path:'', component:Start},
  // {path:'menu', component:MainMenu}
];

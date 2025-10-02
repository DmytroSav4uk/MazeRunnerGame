import { Routes } from '@angular/router';
import {MainMenu} from './components/main-menu/main-menu';
import {Start} from './components/start/start';
import {StartMenu} from './components/start-menu/start-menu';
import {Credits} from './components/credits/credits';
import {MazeLevel} from './components/maze-level/maze-level';

export const routes: Routes = [
  {path:'',component:StartMenu,children:[
      {path:'',component:Start},
      {path:'menu',component:MainMenu},
      {path:'menu/credits',component:Credits}
    ]},
  {path:'maze', component:MazeLevel}
  // {path:'', component:Start},
  // {path:'menu', component:MainMenu}
];

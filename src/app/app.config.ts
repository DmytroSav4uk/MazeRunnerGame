import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {battleReducer} from './store/battle/battle.reducer';
import {provideEffects} from '@ngrx/effects';
import {BattleEffects} from './store/battle/battle.effects';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({battle:battleReducer}),
    provideEffects([BattleEffects])
  ]
};

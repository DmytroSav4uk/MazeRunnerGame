import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BattleState } from './battle.models';

export const selectBattle = createFeatureSelector<BattleState>('battle');

export const selectMainChar = createSelector(selectBattle, s => s.mainChar);
export const selectEnemy = createSelector(selectBattle, s => s.enemy);
export const selectCurrentTurn = createSelector(selectBattle, s => s.currentTurn);
export const selectMessage = createSelector(selectBattle, s => s.actionMessage);

export const selectFinishInfo = createSelector(selectBattle, s => ({
  showFinish: s.showFinish,
  victory: s.victory,
}));

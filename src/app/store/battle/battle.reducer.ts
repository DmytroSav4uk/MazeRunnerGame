import { createReducer, on } from '@ngrx/store';
import * as BattleActions from './battle.actions';
import { BattleState } from './battle.models';

export const initialState: BattleState = {
  mainChar: null as any,
  enemy: null,

  currentTurn: null,

  playerInitiative: 0,
  enemyInitiative: 0,

  isPlayerDefending: false,
  isEnemyDefending: false,

  actionMessage: null,

  showFinish: false,
  victory: false,

  showEscapeWindow: false,
  escapeMessage: null,
};

export const battleReducer = createReducer(
  initialState,

  on(BattleActions.setInitialData, (s, { mainChar, enemy }) => ({
    ...s,
    mainChar,
    enemy
  })),

  on(BattleActions.setInitiativeResult, (s, { playerInit, enemyInit }) => ({
    ...s,
    playerInitiative: playerInit,
    enemyInitiative: enemyInit,
    currentTurn: playerInit >= enemyInit ? 'player' : 'enemy'
  })),

  on(BattleActions.startPlayerTurn, (s) => ({
    ...s,
    currentTurn: 'player',
    isEnemyDefending: false
  })),

  on(BattleActions.startEnemyTurn, (s) => ({
    ...s,
    currentTurn: 'enemy',
    isPlayerDefending: false
  })),

  on(BattleActions.playerDefend, (s) => ({
    ...s,
    isPlayerDefending: true
  })),

  on(BattleActions.enemyDefend, (s) => ({
    ...s,
    isEnemyDefending: true
  })),

  on(BattleActions.applyEnemyDamage, (s, { damage }) => ({
    ...s,
    enemy: {
      ...s.enemy!,
      health: Math.max(0, s.enemy!.health - damage)
    }
  })),

  on(BattleActions.applyPlayerDamage, (s, { damage }) => ({
    ...s,
    mainChar: {
      ...s.mainChar!,
      health: Math.max(0, s.mainChar!.health - damage)
    }
  })),

  on(BattleActions.setActionMessage, (s, { message }) => ({
    ...s,
    actionMessage: message
  })),

  on(BattleActions.finishBattle, (s, { victory }) => ({
    ...s,
    showFinish: true,
    victory
  })),

  on(BattleActions.escapeResolved, (s, { success }) => ({
    ...s,
    showEscapeWindow: true,
    escapeMessage: success ? "Success!" : "Escape failed!"
  })),
);

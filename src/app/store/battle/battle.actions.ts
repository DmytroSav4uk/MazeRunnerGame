import { createAction, props } from '@ngrx/store';

export const loadBattleData = createAction('[Battle] Load Initial Data');

export const setInitialData = createAction(
  '[Battle] Set Initial Data',
  props<{ mainChar: any; enemy: any }>()
);

export const rollInitiative = createAction('[Battle] Roll Initiative');
export const setInitiativeResult = createAction(
  '[Battle] Set Initiative Result',
  props<{ playerInit: number; enemyInit: number }>()
);

export const startPlayerTurn = createAction('[Battle] Player Turn Start');
export const startEnemyTurn = createAction('[Battle] Enemy Turn Start');


export const playerAttack = createAction('[Battle] Player Attack');
export const playerDefend = createAction('[Battle] Player Defend');

export const escapeAttempt = createAction('[Battle] Escape Attempt');
export const escapeResolved = createAction(
  '[Battle] Escape Resolved',
  props<{ success: boolean }>()
);

export const enemyAttack = createAction('[Battle] Enemy Attack');
export const enemyDefend = createAction('[Battle] Enemy Defend');
export const enemyTurnFinished = createAction('[Battle] Enemy Turn Finished');

export const applyPlayerDamage = createAction(
  '[Battle] Apply Player Damage',
  props<{ damage: number }>()
);
export const applyEnemyDamage = createAction(
  '[Battle] Apply Enemy Damage',
  props<{ damage: number }>()
);

export const setActionMessage = createAction(
  '[Battle] Set Action Message',
  props<{ message: string | null }>()
);

export const finishBattle = createAction(
  '[Battle] Finish Battle',
  props<{ victory: boolean }>()
);

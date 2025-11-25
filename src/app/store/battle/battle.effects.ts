import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom, delay } from 'rxjs/operators';
import * as BattleActions from './battle.actions';
import { Store } from '@ngrx/store';
import { selectBattle } from './battle.selectors';
import { of } from 'rxjs';

@Injectable()
export class BattleEffects {

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  rollInitiative$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.rollInitiative),
      map(() => {
        const playerInit = Math.floor(Math.random() * 20) + 1;
        const enemyInit = Math.floor(Math.random() * 20) + 1;
        return BattleActions.setInitiativeResult({ playerInit, enemyInit });
      })
    )
  );


  playerAttack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.playerAttack),
      withLatestFrom(this.store.select(selectBattle)),
      switchMap(([_, state]) => {
        const roll = Math.floor(Math.random() * 20) + 1;

        if (roll > state.enemy!.armor) {
          const damage = Math.floor(Math.random() * state.mainChar.damage) + 1;
          const realDamage = state.isEnemyDefending ? damage / 2 : damage;

          return [
            BattleActions.applyEnemyDamage({ damage: realDamage }),
            BattleActions.setActionMessage({ message: `Hero deals ${realDamage} damage!` }),
            ...(state.enemy!.health - realDamage <= 0
              ? [BattleActions.finishBattle({ victory: true })]
              : [BattleActions.startEnemyTurn()])
          ];
        }

        return [
          BattleActions.setActionMessage({ message: 'Hero missed!' }),
          BattleActions.startEnemyTurn()
        ];
      })
    )
  );

  playerDefend$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.playerDefend),
      withLatestFrom(this.store.select(selectBattle)),
      switchMap(([_, state]) => {

        return of(BattleActions.startEnemyTurn()).pipe(delay(700));
      })
    )
  );

  escapeAttempt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.escapeAttempt),
      withLatestFrom(this.store.select(selectBattle)),
      switchMap(([_, state]) => {
        const hpPercent = state.mainChar.health / state.mainChar.maxHealth;
        const chance = 30 + (1 - hpPercent) * 60;
        const roll = Math.random() * 100;
        const success = roll < chance;
        return [BattleActions.escapeResolved({ success })];
      })
    )
  );


  startEnemyTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.startEnemyTurn),
      withLatestFrom(this.store.select(selectBattle)),
      switchMap(([_, state]) => {
        const action = Math.random() < 0.7 ? 'attack' : 'defend';

        if (action === 'attack') {
          return of(BattleActions.enemyAttack()).pipe(delay(700));
        } else {
          return of(BattleActions.enemyDefend()).pipe(delay(500));
        }
      })
    )
  );

  enemyAttack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.enemyAttack),
      withLatestFrom(this.store.select(selectBattle)),
      switchMap(([_, state]) => {
        const roll = Math.floor(Math.random() * 20) + 1;

        if (roll > state.mainChar.armor) {
          const damage = Math.floor(Math.random() * state.enemy!.damage) + 1;
          const realDamage = state.isPlayerDefending ? damage / 2 : damage;

          return [
            BattleActions.applyPlayerDamage({ damage: realDamage }),
            BattleActions.setActionMessage({ message: `Enemy deals ${realDamage} damage!` }),
            ...(state.mainChar.health - realDamage <= 0
              ? [BattleActions.finishBattle({ victory: false })]
              : [BattleActions.enemyTurnFinished()])
          ];
        }

        return [
          BattleActions.setActionMessage({ message: 'Enemy missed!' }),
          BattleActions.enemyTurnFinished()
        ];
      })
    )
  );

  enemyDefend$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.enemyDefend),
      switchMap(() => {
        return of(BattleActions.enemyTurnFinished()).pipe(delay(700));
      })
    )
  );

  enemyTurnFinished$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BattleActions.enemyTurnFinished),
      map(() => BattleActions.startPlayerTurn())
    )
  );
}

import { IEnemy } from "../../interfaces/Enemy";
import { IMainChar } from "../../interfaces/mainChar";

export interface BattleState {
  mainChar: IMainChar;
  enemy: IEnemy | null;

  currentTurn: 'player' | 'enemy' | null;

  playerInitiative: number;
  enemyInitiative: number;

  isPlayerDefending: boolean;
  isEnemyDefending: boolean;

  actionMessage: string | null;

  showFinish: boolean;
  victory: boolean;

  showEscapeWindow: boolean;
  escapeMessage: string | null;
}

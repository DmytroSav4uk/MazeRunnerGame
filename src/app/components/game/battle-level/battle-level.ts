import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SavesService} from '../../../services/saves/saves-service';
import {ISave} from '../../../interfaces/save';
import {cloneEnemy, Direction, IEnemy, IEnemyAnimations, MushroomEnemy, SkeletonEnemy} from '../../../interfaces/Enemy';
import {ICharacterAnimations, IMainChar, MainChar} from '../../../interfaces/mainChar';
import {PublicFunctions} from '../../../services/publicFunctions/public-functions';
import {NgStyle} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {InventoryDialog} from '../../dialogs/inventory-dialog/inventory-dialog';
import {MusicService} from '../../../services/music/music';
import {Store} from '@ngrx/store';
import * as BattleActions from '../../../store/battle/battle.actions';
import {
  selectBattle,
  selectMainChar,
  selectEnemy,
  selectCurrentTurn,
  selectMessage,
  selectFinishInfo
} from '../../../store/battle/battle.selectors';
import {Subscription} from 'rxjs';

export type CharacterAnimState = keyof ICharacterAnimations;
export type EnemyAnimState = keyof IEnemyAnimations;

@Component({
  selector: 'app-battle-level',
  templateUrl: './battle-level.html',
  imports: [
    NgStyle
  ],
  styleUrls: ['./battle-level.css']
})
export class BattleLevel implements OnInit, AfterViewInit, OnDestroy {

  beforeBattleSave: any;
  battleBiome: string | undefined;
  backgroundImage: string | undefined;

  enemy!: IEnemy;
  mainChar: IMainChar = MainChar;

  heroCtx!: CanvasRenderingContext2D;
  enemyCtx!: CanvasRenderingContext2D;

  heroImg = new Image();
  enemyImg = new Image();

  heroFrame = 0;
  enemyFrame = 0;

  lastHeroFrameTime = 0;
  lastEnemyFrameTime = 0;

  currentHeroAnim: CharacterAnimState = 'Idle';
  currentEnemyAnim: EnemyAnimState = 'Idle';

  currentHeroDir: Direction = 'Down';

  actionMessage: string | null = null;
  currentTurn: 'player' | 'enemy' | null = null;

  heroOffset: number = 0;
  enemyOffset: number = 0;

  isPlayerDefending: boolean = false;
  isEnemyDefending: boolean = false;

  showEscapeWindow: boolean = false;
  escapeMessage: any;

  finishMessage: any;
  victory: boolean = false;
  showFinish: boolean = false;

  private subs: Subscription[] = [];

  constructor(
    private store: Store,
    private savesService: SavesService,
    private publicFunc: PublicFunctions,
    private dialog: MatDialog,
    private musicService: MusicService
  ) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(selectMainChar).subscribe(m => {
        if (m) this.mainChar = m
      }),
      this.store.select(selectEnemy).subscribe(e => {
        if (e) this.enemy = e
      }),
      this.store.select(selectMessage).subscribe(m => this.actionMessage = m),
      this.store.select(selectCurrentTurn).subscribe(t => this.currentTurn = t),
      this.store.select(selectFinishInfo).subscribe(f => {
        this.showFinish = f.showFinish;
        this.victory = f.victory;
        if (f.showFinish) this.finishMessage = f.victory ? 'VICTORY' : 'DEFEAT';
      })


    );

    this.subs.push(
      this.store.select(selectCurrentTurn).subscribe(turn => {
        this.currentTurn = turn;
        if (turn === 'enemy') {
          this.enemyAction();
        }
      })
    );


    this.loadInitialData();
    this.startMusic();
  }

  private enemyAction() {
    if (!this.enemy) return;

    const choice = Math.random();
    if (choice < 0.7) {

      this.enemyAttack();
    } else {

      this.enemyDefend();
      setTimeout(() => {
        this.finishEnemyTurn();
      }, 500);
    }
  }

  ngAfterViewInit(): void {
    this.initCanvasContexts();
  }

  ngOnDestroy() {
    this.musicService.stopMusic();
    this.subs.forEach(s => s.unsubscribe());
  }

  startMusic() {
    this.musicService.playMusic('assets/music/battleMusic.wav');
  }

  private initCanvasContexts(): void {
    const heroCanvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
    const enemyCanvas = document.getElementById('enemyCanvas') as HTMLCanvasElement;

    this.heroCtx = heroCanvas.getContext('2d')!;
    this.enemyCtx = enemyCanvas.getContext('2d')!;
    this.setImageSmoothing(false);
  }

  private setImageSmoothing(enabled: boolean): void {
    [this.heroCtx, this.enemyCtx].forEach(ctx => {
      ctx.imageSmoothingEnabled = enabled;
      (ctx as any).mozImageSmoothingEnabled = enabled;
      (ctx as any).webkitImageSmoothingEnabled = enabled;
    });
  }

  private loadInitialData(): void {
    this.savesService.loadGame('beforeBattle').subscribe((res: any) => {
      this.beforeBattleSave = res.data;
      const data: ISave = res.data;

      this.battleBiome = data.currentBiome.name;
      this.setBackgroundImage();
      this.setEnemy();
      this.startAnimationLoop();

      this.store.dispatch(BattleActions.setInitialData({
        mainChar: this.mainChar,
        enemy: this.enemy
      }));

      this.store.dispatch(BattleActions.rollInitiative());
    });
  }

  private setBackgroundImage(): void {
    switch (this.battleBiome) {
      case 'Emerald Woods':
        this.backgroundImage = 'assets/battle/forestBattle.jpg';
        break;
      case 'Spooky Dungeon':
        this.backgroundImage = 'assets/battle/dungeonBattle.png';
        break;
      default:
        this.backgroundImage = 'assets/battle/dungeonBattle.png';
    }
  }

  private setEnemy(): void {
    switch (this.battleBiome) {
      case 'Emerald Woods':
        this.enemy = cloneEnemy(MushroomEnemy);
        break;
      case 'Spooky Dungeon':
        this.enemy = cloneEnemy(SkeletonEnemy);
        break;
      default:
        this.enemy = cloneEnemy(SkeletonEnemy);
    }
  }

  private startAnimationLoop(): void {
    const loop = (time: number) => {
      this.updateHeroAnimation(time);
      this.updateEnemyAnimation(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private updateHeroAnimation(time: number): void {
    const heroAnim = this.mainChar.animations[this.currentHeroAnim]![this.currentHeroDir];

    if (time - this.lastHeroFrameTime > heroAnim.frameSpeed) {
      if (this.currentHeroAnim === 'Death') {
        if (this.heroFrame < heroAnim.frames - 1) this.heroFrame++;
      } else {
        this.heroFrame = (this.heroFrame + 1) % heroAnim.frames;
      }
      this.lastHeroFrameTime = time;
    }

    this.heroImg.src = this.mainChar.spritePath;
    this.drawFrame(this.heroCtx, this.heroImg, heroAnim, this.heroFrame, true);
  }

  private updateEnemyAnimation(time: number): void {
    const enemyAnim =
      this.enemy.animations?.[this.currentEnemyAnim] ??
      this.enemy.animations?.['Idle'];
    if (!enemyAnim) return;

    if (time - this.lastEnemyFrameTime > enemyAnim.frameSpeed) {
      if (this.currentEnemyAnim === 'Death') {
        if (this.enemyFrame < enemyAnim.frames - 1) this.enemyFrame++;
      } else {
        this.enemyFrame = (this.enemyFrame + 1) % enemyAnim.frames;
      }
      this.lastEnemyFrameTime = time;
    }

    this.enemyImg.src = enemyAnim.spritePath;
    const flip = !(this.enemy.name === 'Angry Mushroom' && this.currentEnemyAnim === 'Attack');

    this.drawFrame(this.enemyCtx, this.enemyImg, enemyAnim, this.enemyFrame, false, 0, flip);
  }

  private drawFrame(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    anim: any,
    frame: number,
    anchorBottom: boolean = false,
    bottomOffset: number = 30,
    flipH: boolean = false
  ): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const startX = anim.startX ?? 0;
    const startY = anim.startY ?? 0;

    const sx = startX + anim.frameWidth * frame;
    const scale = 2;

    const drawWidth = anim.frameWidth * scale + 30;
    const drawHeight = anim.frameHeight * scale;
    let drawX = 50;
    const drawY = anchorBottom ? ctx.canvas.height - drawHeight - bottomOffset : 0;

    ctx.save();

    if (flipH) {
      ctx.translate(drawX + drawWidth, 0);
      ctx.scale(-1, 1);
      drawX = 0;
    }

    ctx.drawImage(img, sx, startY, anim.frameWidth, anim.frameHeight, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }

  // ----------------------------
  // ACTIONS
  // ----------------------------

  attack() {
    if (this.currentTurn !== 'player') return;

    this.currentHeroAnim = 'Attack';
    this.heroOffset = 370;
    this.enemyOffset = 0;

    this.store.dispatch(BattleActions.playerAttack());

    setTimeout(() => {
      this.heroOffset = 0;
      this.enemyOffset = 0;
      this.currentHeroAnim = 'Idle';
    }, 680);
  }

  defend() {
    if (this.currentTurn !== 'player') return;
    this.store.dispatch(BattleActions.playerDefend());
  }

  escapeFromBattle() {
    if (this.currentTurn !== 'player') return;
    this.store.dispatch(BattleActions.escapeAttempt());
  }

  inventory() {
    if (this.currentTurn !== 'player') return;

    const dialogRef = this.dialog.open(InventoryDialog, {
      width: '500px',
      data: {mainChar: this.mainChar}
    });

    dialogRef.afterClosed().subscribe();
  }

  private enemyTurn() {
    this.store.dispatch(BattleActions.startEnemyTurn());
  }

  private enemyAttack() {
    this.currentEnemyAnim = 'Attack';
    this.enemyOffset = -370;
    this.heroOffset = 0;
    this.store.dispatch(BattleActions.enemyAttack());

    setTimeout(()=>{
      this.currentEnemyAnim = 'Idle';
    },1000)

  }

  private finishEnemyTurn() {
    this.currentEnemyAnim = 'Idle';
    this.store.dispatch(BattleActions.enemyTurnFinished());
  }

  private enemyDefend() {
    this.store.dispatch(BattleActions.enemyDefend());
  }

  redirectTo(whereTo: string) {
    this.publicFunc.redirectTo(whereTo);
  }
}

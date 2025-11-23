import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SavesService} from '../../../services/saves/saves-service';
import {ISave} from '../../../interfaces/save';
import {cloneEnemy, Direction, IEnemy, IEnemyAnimations, MushroomEnemy, SkeletonEnemy} from '../../../interfaces/Enemy';
import {ICharacterAnimations, IMainChar, MainChar} from '../../../interfaces/mainChar';
import {PublicFunctions} from '../../../services/publicFunctions/public-functions';
import {NgStyle} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {InventoryDialog} from '../../dialogs/inventory-dialog/inventory-dialog';

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
export class BattleLevel implements OnInit, AfterViewInit {

  // ----------------------------
  // Properties
  // ----------------------------
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

  heroOffset: number = 0;
  enemyOffset: number = 0;


  constructor(private savesService: SavesService, private publicFunc: PublicFunctions, private dialog: MatDialog) {
  }


  // ----------------------------
  // Lifecycle Hooks
  // ----------------------------
  ngOnInit(): void {
    this.loadInitialData();
    console.log(this.mainChar);
  }

  ngAfterViewInit(): void {
    this.initCanvasContexts();
  }


  // ----------------------------
  // Initialization
  // ----------------------------
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


  // ----------------------------
  // Data Loading
  // ----------------------------
  private loadInitialData(): void {
    this.savesService.loadGame('beforeBattle').subscribe((res: any) => {
      this.beforeBattleSave = res.data;
      const data: ISave = res.data;

      this.battleBiome = data.currentBiome.name;

      this.setBackgroundImage();
      this.setEnemy();
      this.startAnimationLoop();
      this.initiativeRoll();
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

    console.log('Background image set to:', this.backgroundImage);
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


  // ----------------------------
  // Animation
  // ----------------------------
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

        if (this.heroFrame < heroAnim.frames - 1) {
          this.heroFrame += 1;
        }

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
        if (this.enemyFrame < enemyAnim.frames - 1) {
          this.enemyFrame += 1;
        }
      } else {
        this.enemyFrame = (this.enemyFrame + 1) % enemyAnim.frames;
      }

      this.lastEnemyFrameTime = time;
    }

    this.enemyImg.src = enemyAnim.spritePath;


    const flip = !(this.enemy.name === "Angry Mushroom" && this.currentEnemyAnim === 'Attack');

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

    ctx.drawImage(
      img,
      sx,
      startY,
      anim.frameWidth,
      anim.frameHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }


  // ----------------------------
  // Actions
  // ----------------------------

  attack() {
    if (this.currentTurn !== 'player') return;
    if (!this.enemy) return;

    this.currentHeroAnim = 'Attack';
    this.heroOffset = 370;
    this.enemyOffset = 0;

    const roll = Math.floor(Math.random() * 20) + 1;

    if (roll > this.enemy.armor) {
      const damage = Math.floor(Math.random() * this.mainChar.damage) + 1;

      if (!this.isEnemyDefending) {
        this.enemy.health -= damage;
      } else {
        this.enemy.health -= damage / 2;
      }

      if (this.enemy.health < 0) this.enemy.health = 0;

      this.actionMessage = `Hero deals ${damage} damage!`;

      if (this.enemy.health === 0) {
        this.currentHeroAnim = "Idle";
        this.currentEnemyAnim = 'Death';
        this.finishBattle('victory');
        return;
      }

    } else {
      this.actionMessage = 'Hero missed!';
    }

    setTimeout(() => {
      this.heroOffset = 0;
      this.enemyOffset = 0;
      this.isEnemyDefending = false;

      this.endPlayerTurn();
    }, 680);


    setTimeout(() => {
      this.actionMessage = null;
    }, 1400)

  }


  isPlayerDefending: boolean = false
  isEnemyDefending: Boolean = false

  defend() {
    if (this.currentTurn !== 'player') return;
    this.isPlayerDefending = true
    this.endPlayerTurn();
  }

  showEscapeWindow: boolean = false
  escapeMessage: any

  escapeFromBattle() {
    if (this.currentTurn !== 'player') return;

    this.showEscapeWindow = true;
    this.escapeMessage = "Attempting escape..."

    setTimeout(() => {
      if (!this.mainChar) return;

      const hpPercent = this.mainChar.health / this.mainChar.maxHealth;

      const escapeChance = 30 + (1 - hpPercent) * 60;

      const roll = Math.random() * 100;

      if (roll < escapeChance) {

        this.escapeMessage = "Success!"

        setTimeout(() => {
          this.publicFunc.redirectTo('maze?slot=beforeBattle')
          return;
        }, 1000)

      } else {
        console.log("Escape failed!");
        this.escapeMessage = "Escape failed!"
        setTimeout(() => {
          this.showEscapeWindow = false
        }, 1000)
      }

      setTimeout(() => {
        this.endPlayerTurn();
      }, 2000)
    }, 3000)
  }

  inventory() {
    if (this.currentTurn !== 'player') return;

    console.log('Player opens inventory');

    const dialogRef = this.dialog.open(InventoryDialog, {
      width: '500px',
      data: {mainChar: this.mainChar}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Inventory closed', result);
    });
  }


  private enemyTurn(): void {
    console.log('Enemy turn started');

    setTimeout(() => {

      const action = Math.random() < 0.7 ? 'attack' : 'defend';

      if (action === 'attack') {
        console.log('Enemy attacks!');
        this.enemyAttack();
      } else {
        console.log('Enemy defends!');
        this.enemyDefend();
      }

      this.endEnemyTurn();

    }, 1000); // затримка для анімації
  }

  private enemyAttack(): void {
    if (!this.enemy || !this.mainChar) return;

    this.currentEnemyAnim = 'Attack';
    this.enemyOffset = -370;
    this.heroOffset = 0;

    const roll = Math.floor(Math.random() * 20) + 1;

    if (roll > this.mainChar.armor) {
      const damage = Math.floor(Math.random() * this.enemy.damage) + 1;

      if (!this.isPlayerDefending) {
        this.mainChar.health -= damage;
      } else {
        this.mainChar.health -= damage / 2;
      }

      if (this.mainChar.health < 0) this.mainChar.health = 0;

      this.actionMessage = `Enemy deals ${damage} damage!`;

      if (this.mainChar.health === 0) {
        this.currentEnemyAnim = 'Idle';
        this.currentHeroAnim = 'Death';
        this.finishBattle('defeat');
        return;
      }

    } else {
      this.actionMessage = 'Enemy missed!';
    }

    const enemyAnim = this.enemy.animations?.['Attack'];
    const attackDuration = enemyAnim ? enemyAnim.frameSpeed * enemyAnim.frames : 700;

    setTimeout(() => {
      this.enemyOffset = 0;
      this.heroOffset = 0;
      this.isPlayerDefending = false;
      this.finishEnemyTurn();
    }, attackDuration);


    setTimeout(() => {
      this.actionMessage = null;
    }, 2000)

  }


  private finishEnemyTurn(): void {
    this.currentEnemyAnim = 'Idle';
    this.isPlayerDefending = false;
    this.endEnemyTurn();
  }


  private enemyDefend(): void {
    if (!this.enemy) return;

    this.isEnemyDefending = true;
    console.log('Enemy is defending!');

    setTimeout(() => {
      this.endEnemyTurn();
    }, 700);
  }

  // ----------------------------
  // Initiative & Turn Order
  // ----------------------------

  playerInitiative: number = 0;
  enemyInitiative: number = 0;

  currentTurn: 'player' | 'enemy' | null = null;

  private initiativeRoll(): void {
    this.playerInitiative = Math.floor(Math.random() * 20) + 1;
    this.enemyInitiative = Math.floor(Math.random() * 20) + 1;

    console.log('Player initiative:', this.playerInitiative);
    console.log('Enemy initiative:', this.enemyInitiative);

    if (this.playerInitiative >= this.enemyInitiative) {
      this.currentTurn = 'player';
      console.log('Player goes first');
      this.playerTurn();
    } else {
      this.currentTurn = 'enemy';
      console.log('Enemy goes first');
      this.enemyTurn();
    }
  }

  private playerTurn(): void {
    console.log('Player turn started');
  }


  private endPlayerTurn(): void {
    this.currentTurn = 'enemy';
    this.currentHeroAnim = "Idle"
    this.enemyTurn();
  }


  private endEnemyTurn(): void {
    this.currentTurn = 'player';
    this.playerTurn();
  }


  finishMessage: any
  victory: boolean = false
  showFinish: boolean = false


  private finishBattle(result: string) {
    this.showFinish = true
    this.finishMessage = result.toUpperCase()
    this.victory = result === 'victory';
  }


  redirectTo(whereTo: string) {
    this.publicFunc.redirectTo(whereTo)
  }
}

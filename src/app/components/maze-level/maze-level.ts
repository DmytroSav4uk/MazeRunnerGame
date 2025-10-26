import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {Maze, keyboardMap, actionMap} from './models';
import {FormsModule} from '@angular/forms';
import {MainChar, Direction, IAnimationFrames, createInventory} from '../../interfaces/mainChar';
import {SavesService} from '../../services/saves/saves-service';
import {Router, ActivatedRoute} from '@angular/router';
import {SaveSlots} from '../save-slots/save-slots';
import {equivalentKeys} from '../../configs/equivalents';
import {PublicFunctions} from '../../services/publicFunctions/public-functions';
import {IEnemy, MushroomEnemy} from '../../interfaces/Enemy';
import {IBiome, forest, dungeon, winterForest} from '../../interfaces/Biome';
import {SkeletonEnemy} from '../../interfaces/Enemy';
import {Chest, IChest} from '../../interfaces/Chest';
import {
  ArmorUpgrade,
  healingPotion,
  HealthUpgrade,
  IItem, ITEM_REGISTRY,
  UltraSpeedPotion,
  WeaponUpgrade
} from '../../interfaces/Item';
import {MatDialog} from '@angular/material/dialog';
import {ChestDialog} from '../chest-dialog/chest-dialog';
import {InventoryDialog} from '../inventory-dialog/inventory-dialog';

@Component({
  selector: 'app-maze-level',
  imports: [FormsModule, SaveSlots],
  templateUrl: './maze-level.html',
  styleUrl: './maze-level.css'
})
export class MazeLevel implements OnInit, AfterViewInit {

  constructor(
    private saveService: SavesService,
    private router: Router,
    private route: ActivatedRoute,
    private publicFunc: PublicFunctions,
    private dialog: MatDialog
  ) {
  }

// ---------------- GAME STATE ----------------
  currentLevel = 1;
  private paused = false;
  showSaveMenu = false;
  showMenu = false;
  private gameOver = false;
// ---------------- MAZE & PLAYER ----------------
  row = 10;
  col = 10;
  cellSize = 350;
  private wallThickness = 50;
  protected maze!: Maze;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  protected playerX = 0;
  protected playerY = 0;
  private playerWidth = 38;
  private playerHeight = 64;
  // private playerSpeed = MainChar.speed;
// ---------------- CONTROLS ----------------
  private keys: Record<string, boolean> = {};
  private keyboardMap: Record<string, 'Up' | 'Down' | 'Left' | 'Right'> = keyboardMap;
  private actionMap: Record<string, 'Use' | 'Sprint' | 'Inventory'> = actionMap;
// ---------------- ANIMATION ----------------
  private characterImage = new Image();
  private currentAnimation: 'Idle' | 'Walk' | 'Run' = 'Idle';
  private currentDirection: Direction = 'Down';
  private frameIndex = 0;
  private lastFrameTime = 0;
  private lastHorizontalDirection: 'Left' | 'Right' = 'Right';
  private animationFrameId!: number;
// ---------------- LEVEL OBJECTIVES ----------------
  goalRow!: number;
  goalCol!: number;
// ---------------- ENEMIES ----------------
  enemies: IEnemy[] = [];
// ---------------- CHESTS ----------------
  chests: IChest[] = [];
// ---------------- BIOMES ----------------
  currentBiome!: IBiome;
  nextLevelBiome!: IBiome;
  biomes: IBiome[] = [forest

  //  , dungeon, winterForest

  ];
// ---------------- MODAL ----------------
  pickedItem: IItem | null = null;
  showItemModal: boolean = false;
// ==============================================================
// INIT
// ==============================================================

  ngOnInit() {
    this.loadControlsFromLocalStorage();
  }

  private loadControlsFromLocalStorage() {
    const baseKeyboardMap = {...keyboardMap};
    const baseActionMap = {...actionMap};
    const equivalents: Record<string, string[]> = equivalentKeys;

    const savedSettings = this.publicFunc.getLocalStorage('settings');
    if (savedSettings?.controls) {
      const c = savedSettings.controls;
      this.keyboardMap = {};
      this.actionMap = {};

      const addWithEquivalents = (key: unknown, targetMap: Record<string, any>, value: any) => {
        if (!key) return;
        const keys = Array.isArray(key) ? key : [key];
        for (const k of keys) {
          if (typeof k !== 'string' || k.trim() === '') continue;
          const upperKey = k.toUpperCase();
          const allKeys = equivalents[upperKey] || [k];
          for (const ak of allKeys) targetMap[ak] = value;
        }
      };

      addWithEquivalents(c.up, this.keyboardMap, 'Up');
      addWithEquivalents(c.down, this.keyboardMap, 'Down');
      addWithEquivalents(c.left, this.keyboardMap, 'Left');
      addWithEquivalents(c.right, this.keyboardMap, 'Right');
      addWithEquivalents(c.use, this.actionMap, 'Use');
      addWithEquivalents(c.sprint, this.actionMap, 'Sprint');
      addWithEquivalents(c.inventory, this.actionMap, 'Inventory');
    } else {
      this.keyboardMap = baseKeyboardMap;
      this.actionMap = baseActionMap;
    }
  }

  ngAfterViewInit() {
    const canvas = document.getElementById('maze') as HTMLCanvasElement | null;
    if (!canvas) throw new Error('Canvas not found');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not supported');

    this.canvas = canvas;
    this.ctx = ctx;
    this.characterImage.src = MainChar.spritePath;
    this.characterImage.onload = () => {
      const slot = this.route.snapshot.queryParamMap.get('slot');
      if (slot) {
        this.loadSlotFromQuery(slot);
      } else {
        this.setBiome(true);
        this.startLevel();
      }
    };


    console.log(MainChar)
  }

// ==============================================================
// BIOME SYSTEM
// ==============================================================

  private setBiome(initial = false) {
    if (initial || !this.currentBiome) {
      this.currentBiome = this.randomBiome();
      this.nextLevelBiome = this.randomBiome();
    } else {
      this.currentBiome = this.nextLevelBiome;
      this.nextLevelBiome = this.randomBiome();
    }

    console.log(`🌿 Current biome: ${this.currentBiome.name}`);
    console.log(`➡️ Next biome: ${this.nextLevelBiome.name}`);
  }

  private randomBiome(): IBiome {
    const i = Math.floor(Math.random() * this.biomes.length);
    return this.biomes[i];
  }

  private decorateLevel() {
    // 🔹 змінюємо фон під біом
    this.canvas.style.backgroundColor = this.currentBiome.backgroundColor;

    // 🔹 створюємо зображення для стін
    const wallImages: HTMLImageElement[] = this.currentBiome.wallAssets.map(path => {
      const img = new Image();
      img.src = path;
      return img;
    });

    // 🔹 додаємо їх у Maze, щоб він малював декор
    (this.maze as any).wallAssets = wallImages;
  }

// ==============================================================
// SAVE / LOAD
// ==============================================================

  private loadSlotFromQuery(slot: string) {
    this.saveService.loadGame(slot).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data || !data.maze) {
          console.warn('⚠️ invalid save data, starting new level');
          this.setBiome(true);
          this.startLevel();
          return;
        }

        const mazeData = data.maze;
        const cellsData = typeof mazeData.cells === 'string' ? JSON.parse(mazeData.cells) : mazeData.cells;

        this.currentLevel = data.level;
        this.playerX = data.playerX;
        this.playerY = data.playerY;

        this.row = mazeData.nRow;
        this.col = mazeData.nCol;
        this.cellSize = mazeData.cellSize;

        this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx, cellsData);
        this.goalRow = data.goalRow ?? Math.floor(Math.random() * this.row);
        this.goalCol = data.goalCol ?? Math.floor(Math.random() * this.col);

        if (data.currentBiome && data.nextLevelBiome) {
          this.currentBiome = this.biomes.find(b => b.name === data.currentBiome.name) || this.randomBiome();
          this.nextLevelBiome = this.biomes.find(b => b.name === data.nextLevelBiome.name) || this.randomBiome();
        } else {
          this.setBiome(true);
        }

        this.decorateLevel();
        this.decorateEnemies();

        if (Array.isArray(data.chests) && data.chests.length > 0) {
          this.chests = data.chests.map((savedChest: any) => {
            return {
              ...Chest,
              row: savedChest.row,
              col: savedChest.col,
              isOpen: savedChest.isOpen ?? false,
              itemInside: savedChest.itemInside ?? null,
              frameIndex: savedChest.isOpen ? (Chest.animations.Open.frames.length - 1) : 0,
              lastFrameTime: 0
            };
          });
        } else {
          this.spawnChests();
        }

        if (data.playerState) {
          const p = data.playerState;
          MainChar.health = p.health ?? MainChar.health;
          MainChar.maxHealth = p.maxHealth ?? MainChar.maxHealth;
          MainChar.damage = p.damage ?? MainChar.damage;
          MainChar.armor = p.armor ?? MainChar.armor;

          this.loadPlayerInventory(p.inventory);
        }


        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gameOver = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.gameLoop();

        this.router.navigate([], {relativeTo: this.route, queryParams: {}, replaceUrl: true});
      },
      error: (err) => {
        console.error('❌ load slot error:', err);
        this.setBiome(true);
        this.startLevel();
      }
    });
  }

  private loadPlayerInventory(savedInventory: any[]) {
    if (!Array.isArray(savedInventory)) return;

    const newInventory = createInventory();

    for (const slot of savedInventory) {
      if (!slot?.name) continue;

      const itemKey = Object.keys(ITEM_REGISTRY)
        .find(key => key.toLowerCase() === slot.name.toLowerCase());

      if (!itemKey) {
        console.warn(`⚠️ Item "${slot.name}" not found in ITEM_REGISTRY`);
        continue;
      }

      const fullItem = ITEM_REGISTRY[itemKey];
      const quantity = slot.quantity ?? 1;


      newInventory.addItem(fullItem, quantity);

      console.log(`✅ Loaded item: ${fullItem.name}, quantity: ${quantity}`);
    }


    MainChar.inventory = newInventory;
  }

// ==============================================================
// LEVEL SETUP
// ==============================================================

  startLevel() {
    this.updateGridSizeByLevel();
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.setRandomGoal();
    this.playerX = this.cellSize / 2;
    this.playerY = this.cellSize / 2;
    this.decorateLevel();
    this.decorateEnemies();
    this.spawnChests();

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gameOver = false;

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.gameLoop();
  }

  private updateGridSizeByLevel() {
    const extra = Math.floor((this.currentLevel - 1) / 2) * 2;
    this.row = Math.min(10 + extra, 60);
    this.col = Math.min(10 + extra, 60);
  }

  private setRandomGoal() {
    do {
      this.goalRow = Math.floor(Math.random() * this.row);
      this.goalCol = Math.floor(Math.random() * this.col);
    } while (this.goalRow === 0 && this.goalCol === 0);
  }

// ==============================================================
// ENEMIES
// ==============================================================

  private decorateEnemies() {
    this.enemies = [];
    if (this.currentLevel < 3) return;

    const biomeName = this.currentBiome.name;
    const allEnemies: IEnemy[] = [
      SkeletonEnemy,
      MushroomEnemy
    ];

    const biomeEnemies = allEnemies.filter(e => e.biome === biomeName);
    if (biomeEnemies.length === 0) {
      console.warn(`⚠️ No enemies found for biome ${biomeName}`);
      return;
    }

    const baseEnemies = 2;
    const extra = Math.floor((this.currentLevel - 3) / 4);
    const maxEnemies = Math.min(baseEnemies + extra, 8);
    const count = Math.floor(Math.random() * maxEnemies) + 1;

    for (let i = 0; i < count; i++) {
      const enemyTemplate = biomeEnemies[Math.floor(Math.random() * biomeEnemies.length)];

      let r, c;
      do {
        r = Math.floor(Math.random() * this.row);
        c = Math.floor(Math.random() * this.col);
      } while ((r === 0 && c === 0) || (r === this.goalRow && c === this.goalCol));

      const enemy: IEnemy = {
        ...enemyTemplate,
        x: (c + 0.5) * this.cellSize,
        y: (r + 0.5) * this.cellSize,
        row: r,
        col: c,
        direction: ['Up', 'Down', 'Left', 'Right'][Math.floor(Math.random() * 4)] as any
      };


      const anim = enemy.animations?.Idle;
      if (anim) {
        const img = new Image();
        img.src = anim.spritePath;
        enemy.image = img;
        enemy.currentAnimation = 'Idle';
        enemy.frameIndex = 0;
        enemy.lastFrameTime = 0;
      }

      this.enemies.push(enemy);
    }

    console.log(`👾 Spawned ${this.enemies.length} enemies for biome ${biomeName}`);
  }

  private moveEnemies() {
    for (const enemy of this.enemies) {

      const oldX = enemy.x;
      const oldY = enemy.y;


      if (Math.random() < 0.02) {
        const dirs = ['Up', 'Down', 'Left', 'Right'];
        enemy.direction = dirs[Math.floor(Math.random() * 4)] as any;
      }

      let nextX = enemy.x;
      let nextY = enemy.y;

      switch (enemy.direction) {
        case 'Up':
          nextY -= enemy.speed;
          break;
        case 'Down':
          nextY += enemy.speed;
          break;
        case 'Left':
          nextX -= enemy.speed;
          break;
        case 'Right':
          nextX += enemy.speed;
          break;
      }

      if (!this.isWallCollision(nextX, nextY)) {
        enemy.x = nextX;
        enemy.y = nextY;
      }

      const moved = Math.abs(enemy.x - oldX) > 0.1 || Math.abs(enemy.y - oldY) > 0.1;

      const desiredAnim = moved ? 'Walk' : 'Idle';
      if (enemy.currentAnimation !== desiredAnim) {
        enemy.currentAnimation = desiredAnim;

        const anim = enemy.animations?.[desiredAnim];
        if (anim) {
          const img = new Image();
          img.src = anim.spritePath;
          enemy.image = img;
          enemy.frameIndex = 0;
          enemy.lastFrameTime = 0;
        }
      }

      const dx = this.playerX - enemy.x;
      const dy = this.playerY - enemy.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.cellSize / 3) {
        this.startBattle()
      }
    }
  }


  private startBattle() {

  }

  private drawEnemies(camOffsetX: number, camOffsetY: number) {
    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);

    for (const e of this.enemies) {
      const anim = e.animations?.[e.currentAnimation || 'Idle'];
      const img = e.image;
      if (!anim || !img) continue;


      const now = Date.now();
      if (now - (e.lastFrameTime ?? 0) > anim.frameSpeed) {
        e.frameIndex = ((e.frameIndex ?? 0) + 1) % anim.frames;
        e.lastFrameTime = now;
      }

      const sx = (e.frameIndex ?? 0) * anim.frameWidth;
      const sy = 0;
      const scale = e.spriteScale ?? 1;

      const dx = e.x - (anim.frameWidth * scale) / 2;
      const dy = e.y - (anim.frameHeight * scale);

      this.ctx.save();


      if (e.direction === 'Left') {
        this.ctx.translate(dx + anim.frameWidth * scale, dy);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          img,
          sx, sy, anim.frameWidth, anim.frameHeight,
          0, 0,
          anim.frameWidth * scale, anim.frameHeight * scale
        );
      } else {
        this.ctx.drawImage(
          img,
          sx, sy, anim.frameWidth, anim.frameHeight,
          dx, dy,
          anim.frameWidth * scale, anim.frameHeight * scale
        );
      }

      this.ctx.restore();
    }

    this.ctx.restore();
  }

// ==============================================================
// GAME LOOP
// ==============================================================

  private gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

    this.updatePlayerPosition();
    this.moveEnemies();
    this.updateAnimationState();

    const camOffsetX = this.canvas.width / 2 - this.playerX;
    const camOffsetY = this.canvas.height / 2 - this.playerY;

    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);

    this.maze.draw(this.wallThickness);

    this.ctx.restore();

    this.drawChests(camOffsetX, camOffsetY);
    this.drawGoal();
    this.drawEnemies(camOffsetX, camOffsetY);
    this.drawPlayer();

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

// ==============================================================
// RENDERING
// ==============================================================

  private drawGoal() {
    const camOffsetX = this.canvas.width / 2 - this.playerX;
    const camOffsetY = this.canvas.height / 2 - this.playerY;
    const x = this.goalCol * this.cellSize;
    const y = this.goalRow * this.cellSize;
    const size = this.cellSize / 2;


    let goalColor = '#00ff00';
    switch (this.nextLevelBiome.name) {
      case 'Emerald Woods':
        goalColor = '#00ff00';
        break;
      case 'Spooky Dungeon':
        goalColor = '#ff00ff';
        break;
      case 'Glassy Forest':
        goalColor = '#00ffff';
        break;
    }

    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);
    this.ctx.fillStyle = goalColor;
    this.ctx.fillRect(x + this.cellSize / 4, y + this.cellSize / 4, size, size);
    this.ctx.restore();
  }

// ==============================================================
// PLAYER MOVEMENT & COLLISION
// ==============================================================

  private isAtGoal(): boolean {
    const goalX = (this.goalCol + 0.5) * this.cellSize;
    const goalY = (this.goalRow + 0.5) * this.cellSize;
    const dx = this.playerX - goalX;
    const dy = this.playerY - goalY;
    return Math.sqrt(dx * dx + dy * dy) < this.cellSize / 4;
  }

  private completeLevel() {
    if (!this.gameOver) {
      this.gameOver = true;
      setTimeout(() => {
        this.currentLevel++;
        this.setBiome();
        this.startLevel();
      }, 500);
    }
  }

  private updateAnimationState() {
    const prev = this.currentAnimation;
    const movingH = this.keys['Left'] || this.keys['Right'];
    const movingV = this.keys['Up'] || this.keys['Down'];
    const moving = movingH || movingV;

    if (this.keys['Left']) {
      this.currentDirection = 'Left';
      this.lastHorizontalDirection = 'Left';
    }
    if (this.keys['Right']) {
      this.currentDirection = 'Right';
      this.lastHorizontalDirection = 'Right';
    }
    if (!movingH && movingV) {
      this.currentDirection = this.lastHorizontalDirection;
    }

    this.currentAnimation = moving
      ? (this.MainChar.speed > 1.5 ? 'Run' : 'Walk')
      : 'Idle';

    if (prev !== this.currentAnimation) {
      this.frameIndex = 0;
      this.lastFrameTime = 0;
    }
  }

  private drawPlayer() {
    const anim: IAnimationFrames = MainChar.animations[this.currentAnimation]![this.currentDirection]!;
    const now = Date.now();
    if (now - this.lastFrameTime > anim.frameSpeed) {
      this.frameIndex = (this.frameIndex + 1) % anim.frames;
      this.lastFrameTime = now;
    }

    const sx = anim.startX + this.frameIndex * anim.frameWidth;
    const sy = anim.startY;
    const scale = 2;
    const dx = this.canvas.width / 2 - (anim.frameWidth * scale) / 2;
    const dy = this.canvas.height / 2 - (anim.frameHeight * scale) / 2;

    this.ctx.save();
    if (this.currentDirection === 'Left') {
      this.ctx.translate(dx + (anim.frameWidth * scale) / 2, 0);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(this.characterImage, sx, sy, anim.frameWidth, anim.frameHeight,
        -anim.frameWidth / 2, dy, anim.frameWidth * scale, anim.frameHeight * scale);
    } else {
      this.ctx.drawImage(this.characterImage, sx, sy, anim.frameWidth, anim.frameHeight,
        dx, dy, anim.frameWidth * scale, anim.frameHeight * scale);
    }
    this.ctx.restore();
  }

  private updatePlayerPosition() {
    if (this.gameOver) return;
    let nextX = this.playerX;
    let nextY = this.playerY;

    if (this.keys['Left']) nextX -= this.MainChar.speed;
    if (this.keys['Right']) nextX += this.MainChar.speed;
    if (this.keys['Up']) nextY -= this.MainChar.speed;
    if (this.keys['Down']) nextY += this.MainChar.speed;

    if (!this.isWallCollision(nextX, nextY)) {
      this.playerX = nextX;
      this.playerY = nextY;
    }
  }

  private isWallCollision(x: number, y: number): boolean {
    const row = Math.floor(y / this.cellSize);
    const col = Math.floor(x / this.cellSize);
    if (row < 0 || row >= this.row || col < 0 || col >= this.col) return true;

    const cell = this.maze.cells[row][col];
    const offsetX = x - col * this.cellSize;
    const offsetY = y - row * this.cellSize;
    const halfW = this.playerWidth / 2;
    const halfH = this.playerHeight / 2;

    const t = this.wallThickness / 2;

    if (cell.northWall && offsetY - halfH < t) return true;
    if (cell.southWall && offsetY + halfH > this.cellSize - t) return true;
    if (cell.westWall && offsetX - halfW < t) return true;
    if (cell.eastWall && offsetX + halfW > this.cellSize - t) return true;

    return false;
  }

// ==============================================================
// INPUT HANDLING
// ==============================================================
  private inventoryDialogRef: any = null;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a'
    ];

    (this as any)._konamiIndex = (this as any)._konamiIndex ?? 0;

    if (event.key === konamiCode[(this as any)._konamiIndex]) {
      (this as any)._konamiIndex++;
      if ((this as any)._konamiIndex === konamiCode.length) {
        this.showEasterEgg = true;
        (this as any)._konamiIndex = 0;
        setTimeout(() => {
          this.showEasterEgg = false
        }, 15500)
      }
    } else {
      (this as any)._konamiIndex = 0;
    }

    if (this.paused && event.key !== 'Escape') return;

    const direction = this.keyboardMap[event.key];
    const action = this.actionMap[event.key];

    if (direction) this.keys[direction] = true;
    if (action === 'Use') {

      if (this.isAtGoal()) this.completeLevel();


      const playerRow = Math.floor(this.playerY / this.cellSize);
      const playerCol = Math.floor(this.playerX / this.cellSize);

      for (const chest of this.chests) {
        if (!chest.isOpen && chest.row === playerRow && chest.col === playerCol) {
          chest.isOpen = true;

          setTimeout(() => {
            const dialogRef = this.dialog.open(ChestDialog, {
              width: '400px',
              data: {item: chest.itemInside}
            });

            dialogRef.afterClosed().subscribe((result) => {

              MainChar.inventory.addItem(chest.itemInside);
              console.log(`✅ Added ${chest.itemInside.name} to inventory.`);
              console.log(MainChar)
            });
          }, 1000);


          // chest.itemInside.use(MainChar);
        }
      }
    }
    if (action === 'Sprint') this.MainChar.speed = 2;
    if (event.key === 'Escape' || event.key === 'Esc') this.togglePauseMenu();
    if (action === 'Inventory') {

      if (this.inventoryDialogRef && this.inventoryDialogRef.getState() !== 'closed') {
        return;
      }

      this.inventoryDialogRef = this.dialog.open(InventoryDialog, {
        width: '550px',
        data: {items: MainChar.inventory.items},
        disableClose: false
      });

      this.inventoryDialogRef.afterClosed().subscribe(() => {
        this.inventoryDialogRef = null;
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const direction = this.keyboardMap[event.key];
    const action = this.actionMap[event.key];
    if (direction) this.keys[direction] = false;
    if (action === 'Sprint') this.MainChar.speed = 1.5;
  }

  private togglePauseMenu() {
    this.paused = !this.paused;
    this.showMenu = this.paused;
    if (this.paused) {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    } else {
      this.gameLoop();
    }
  }

  continueGame() {
    this.paused = false;
    this.showMenu = false;
    this.gameLoop();
  }

  openSaveMenu() {
    this.showSaveMenu = true;
  }

  goToMainMenu() {
    this.router.navigateByUrl('menu');
  }

// ==============================================================
// Easter_Egg
// ==============================================================

  showEasterEgg: boolean = false

// ==============================================================
// Chests
// ==============================================================
  private spawnChests() {
    this.chests = [];

    const baseCount = 1;
    const extra = Math.floor((this.currentLevel - 1) / 3);
    const chestCount = Math.min(baseCount + extra, 8);

    const possibleItems: IItem[] = [
      healingPotion,
      WeaponUpgrade,
      ArmorUpgrade,
      HealthUpgrade,
      UltraSpeedPotion
    ];

    for (let i = 0; i < chestCount; i++) {
      let r: number, c: number;
      do {
        r = Math.floor(Math.random() * this.row);
        c = Math.floor(Math.random() * this.col);
      } while (
        (r === 0 && c === 0) ||
        (r === this.goalRow && c === this.goalCol) ||
        this.chests.some(ch => ch.row === r && ch.col === c)
        );
      const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
      const chest: IChest = {
        ...Chest,
        itemInside: randomItem,
        row: r,
        col: c,
        isOpen: false,
        frameIndex: 0,
        lastFrameTime: 0
      };
      this.chests.push(chest);
    }
  }

  private drawChests(camOffsetX: number, camOffsetY: number) {
    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);

    for (const chest of this.chests) {
      const anim = chest.isOpen ? chest.animations.Open : chest.animations.Closed;

      const now = Date.now();
      if (!chest.lastFrameTime) chest.lastFrameTime = now;
      if (chest.frameIndex === undefined) chest.frameIndex = 0;

      if (now - chest.lastFrameTime > anim.frameSpeed) {
        if (!chest.isOpen) {
          chest.frameIndex = 0;
        } else if (chest.frameIndex < anim.frames.length - 1) {
          chest.frameIndex++;
        }
        chest.lastFrameTime = now;
      }

      const frame = anim.frames[chest.frameIndex];
      if (!frame) continue;

      const scale = 2;
      const width = anim.frameWidth * scale;
      const height = anim.frameHeight * scale;

      const x = chest.col * this.cellSize + (this.cellSize - width) / 2;
      const y = chest.row * this.cellSize + (this.cellSize - height) / 2;

      this.ctx.drawImage(
        chest.sprite,
        frame.x * anim.frameWidth,
        frame.y * anim.frameHeight,
        anim.frameWidth,
        anim.frameHeight,
        x,
        y,
        width,
        height
      );
    }

    this.ctx.restore();
  }

  closeItemModal() {
    this.showItemModal = false;
    this.pickedItem = null;
  }

  protected readonly MainChar = MainChar;
}

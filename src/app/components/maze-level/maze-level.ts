import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {Maze, keyboardMap} from './models';
import {FormsModule} from '@angular/forms';
import {MainChar, Direction, IAnimationFrames} from '../../interfaces/mainChar';
import {SavesService} from '../../services/saves/saves-service';

import {Router, ActivatedRoute} from '@angular/router';
import {SaveSlots} from '../save-slots/save-slots';

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
    private route: ActivatedRoute
  ) {
  }

  currentLevel = 1;
  private paused = false;
  showSaveMenu = false;

  row = 10;
  col = 10;
  cellSize = 250;

  showMenu = false;

  protected maze!: Maze;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gameOver = false;

  protected playerX = 0;
  protected playerY = 0;
  private playerWidth = 38;
  private playerHeight = 64;
  private playerSpeed = 1.5;

  private keys: Record<string, boolean> = {};
  private characterImage = new Image();
  private currentAnimation: 'Idle' | 'Walk' = 'Idle';
  private currentDirection: Direction = 'Down';
  private frameIndex = 0;
  private lastFrameTime = 0;
  private lastHorizontalDirection: 'Left' | 'Right' = 'Right';
  private animationFrameId!: number;

  goalRow!: number;
  goalCol!: number;

  ngOnInit() {
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
        this.startLevel();
      }
    };
  }


  private loadSlotFromQuery(slot: string) {
    this.saveService.loadGame(slot).subscribe({
      next: (res: any) => {
        console.log('📦 Отримано відповідь із сервера:', res);

        const data = res?.data;
        if (!data || !data.maze) {
          console.warn('⚠️ Немає maze у res.data — запускаємо новий рівень');
          this.startLevel();
          return;
        }

        const mazeData = data.maze;
        let cellsData: any;

        if (typeof mazeData.cells === 'string') {
          try {
            cellsData = JSON.parse(mazeData.cells);
          } catch (e) {
            console.error('❌ Помилка при парсингу maze.cells:', e);
            this.startLevel();
            return;
          }
        } else {
          cellsData = mazeData.cells;
        }

        if (!Array.isArray(cellsData)) {
          this.startLevel();
          return;
        }




        this.currentLevel = data.level;
        this.playerX = data.playerX;
        this.playerY = data.playerY;

        this.row = mazeData.nRow;
        this.col = mazeData.nCol;
        this.cellSize = mazeData.cellSize;

        this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx, cellsData);


        if (typeof data.goalRow === 'number' && typeof data.goalCol === 'number') {
          this.goalRow = data.goalRow;
          this.goalCol = data.goalCol;
        } else {
          this.setRandomGoal();
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.gameOver = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.gameLoop();

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      },
      error: (err) => {
        console.error('❌ Не вдалося завантажити слот:', err);
        this.startLevel();
      }
    });
  }



  /** почати або оновити рівень */
  startLevel() {
    this.updateGridSizeByLevel();

    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.setRandomGoal();

    this.playerX = this.cellSize / 2;
    this.playerY = this.cellSize / 2;
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

  private gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

    this.updatePlayerPosition();
    this.updateAnimationState();

    this.drawMazeCamera();
    this.drawGoal();
    this.drawPlayer();

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private drawMazeCamera() {
    const camOffsetX = this.canvas.width / 2 - this.playerX;
    const camOffsetY = this.canvas.height / 2 - this.playerY;
    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);
    this.maze.draw();
    this.ctx.restore();
  }

  private drawGoal() {
    const camOffsetX = this.canvas.width / 2 - this.playerX;
    const camOffsetY = this.canvas.height / 2 - this.playerY;
    const x = this.goalCol * this.cellSize;
    const y = this.goalRow * this.cellSize;
    const size = this.cellSize / 2;

    this.ctx.save();
    this.ctx.translate(camOffsetX, camOffsetY);
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(x + this.cellSize / 4, y + this.cellSize / 4, size, size);
    this.ctx.restore();
  }

  private isAtGoal(): boolean {
    const goalX = (this.goalCol + 0.5) * this.cellSize;
    const goalY = (this.goalRow + 0.5) * this.cellSize;
    const dx = this.playerX - goalX;
    const dy = this.playerY - goalY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.cellSize / 4;
  }

  private completeLevel() {
    if (!this.gameOver) {
      this.gameOver = true;
      setTimeout(() => {
        this.currentLevel++;
        this.startLevel();
      }, 500);
    }
  }

  private updateAnimationState() {
    if (this.keys['Left']) {
      this.currentDirection = 'Left';
      this.lastHorizontalDirection = 'Left';
    }
    if (this.keys['Right']) {
      this.currentDirection = 'Right';
      this.lastHorizontalDirection = 'Right';
    }
    if (this.keys['Up'] || this.keys['Down']) {
      if (this.lastHorizontalDirection === 'Left' || this.lastHorizontalDirection === 'Right') {
        this.currentDirection = this.lastHorizontalDirection;
      }
    }
    this.currentAnimation = (this.keys['Left'] || this.keys['Right'] || this.keys['Up'] || this.keys['Down'])
      ? 'Walk' : 'Idle';
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
      this.ctx.drawImage(
        this.characterImage,
        sx, sy, anim.frameWidth, anim.frameHeight,
        -anim.frameWidth / 2, dy,
        anim.frameWidth * scale, anim.frameHeight * scale
      );
    } else {
      this.ctx.drawImage(
        this.characterImage,
        sx, sy, anim.frameWidth, anim.frameHeight,
        dx, dy,
        anim.frameWidth * scale, anim.frameHeight * scale
      );
    }
    this.ctx.restore();
  }

  private updatePlayerPosition() {
    if (this.gameOver) return;
    let nextX = this.playerX;
    let nextY = this.playerY;

    if (this.keys['Left']) nextX -= this.playerSpeed;
    if (this.keys['Right']) nextX += this.playerSpeed;
    if (this.keys['Up']) nextY -= this.playerSpeed;
    if (this.keys['Down']) nextY += this.playerSpeed;

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

    if (cell.northWall && offsetY - halfH < 0) return true;
    if (cell.southWall && offsetY + halfH > this.cellSize) return true;
    if (cell.westWall && offsetX - halfW < 0) return true;
    if (cell.eastWall && offsetX + halfW > this.cellSize) return true;

    return false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.paused && event.key !== 'Escape') return;
    const direction = keyboardMap[event.key];
    if (direction) this.keys[direction] = true;

    if ((event.key === 'f' || event.key === 'F') && this.isAtGoal()) this.completeLevel();
    if (event.key === 'Escape' || event.key === 'Esc') this.togglePauseMenu();
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const direction = keyboardMap[event.key];
    if (direction) this.keys[direction] = false;
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

  saves: any;

  getAllSaves() {
    this.saveService.getAll().subscribe((res) => {
      this.saves = res;
    });
  }

  goToMainMenu() {
    this.router.navigateByUrl('menu')
  }
}

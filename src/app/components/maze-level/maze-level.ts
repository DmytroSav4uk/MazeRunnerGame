import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Cell, Maze, keyboardMap } from './models';
import { FormsModule } from '@angular/forms';
import { MainChar, Direction, IAnimationFrames } from './../../interfaces/mainChar';

@Component({
  selector: 'app-maze-level',
  imports: [FormsModule],
  templateUrl: './maze-level.html',
  styleUrl: './maze-level.css'
})
export class MazeLevel implements OnInit, AfterViewInit {
  row = 15;
  col = 15;
  cellSize = 200;

  private maze!: Maze;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gameOver = false;

  // Позиція та розмір персонажа
  private playerX = 0;
  private playerY = 0;
  private playerWidth = 38;
  private playerHeight = 64;
  private playerSpeed = 1.5;

  private keys: Record<string, boolean> = {};

  // Спрайт персонажа
  private characterImage = new Image();
  private currentAnimation: 'Idle' | 'Walk' = 'Idle';
  private currentDirection: Direction = 'Down';
  private frameIndex = 0;
  private lastFrameTime = 0;
  private lastHorizontalDirection: 'Left' | 'Right' = 'Right';
  private animationFrameId!: number;

  private goalRow!: number;
  private goalCol!: number;

  ngOnInit() {}

  ngAfterViewInit() {
    const canvas = document.getElementById('maze') as HTMLCanvasElement | null;
    if (!canvas) throw new Error('Canvas not found');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not supported');

    this.canvas = canvas;
    this.ctx = ctx;

    this.characterImage.src = MainChar.spritePath;
    this.characterImage.onload = () => {
      this.drawMaze();
    };
  }

  private setRandomGoal() {
    do {
      this.goalRow = Math.floor(Math.random() * this.row);
      this.goalCol = Math.floor(Math.random() * this.col);
    } while (this.goalRow === 0 && this.goalCol === 0);
  }

  drawMaze() {
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

    const goalRadius = this.cellSize / 4;
    return distance < goalRadius;
  }

  private completeLevel() {
    if (!this.gameOver) {
      this.gameOver = true;
      this.maze.drawSolution('#4080ff');
    }
  }

  private updateAnimationState() {
    if (this.keys['Left']) { this.currentDirection = 'Left'; this.lastHorizontalDirection = 'Left'; }
    if (this.keys['Right']) { this.currentDirection = 'Right'; this.lastHorizontalDirection = 'Right'; }
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
    if (cell.westWall  && offsetX - halfW < 0) return true;
    if (cell.eastWall  && offsetX + halfW > this.cellSize) return true;

    return false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const direction = keyboardMap[event.key];
    if (direction) this.keys[direction] = true;

    if ((event.key === 'f' || event.key === 'F') && this.isAtGoal()) {
      this.completeLevel();
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const direction = keyboardMap[event.key];
    if (direction) this.keys[direction] = false;
  }

  solution() {
    this.maze.drawSolution('#ff7575', 3);
  }
}

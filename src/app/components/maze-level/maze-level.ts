import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import { Cell, Maze, keyboardMap } from './models';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-maze-level',
  imports: [
    FormsModule
  ],
  templateUrl: './maze-level.html',
  styleUrl: './maze-level.css'
})
export class MazeLevel implements OnInit, AfterViewInit{
  row = 15;
  col = 15;
  cellSize = 20; // cell size
  private maze!: Maze;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell!: Cell;

  ngOnInit() {}

  ngAfterViewInit() {
    const canvas = document.getElementById('maze') as HTMLCanvasElement | null;
    if (!canvas) throw new Error("Canvas not found");

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("2D context not supported");

    this.canvas = canvas;
    this.ctx = ctx;

    this.drawMaze();
  }

  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    const direction = keyboardMap[event.key];
    if (direction) this.move(direction);
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell!: Cell;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) return;
      nextCell = this.maze.cells[this.currentCell.row][
      this.currentCell.col - 1
        ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell = this.maze.cells[this.currentCell.row][
      this.currentCell.col + 1
        ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) return;
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
        ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
        ];
    }
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.hooray();
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }

  solution() {
    this.gameOver = true;
    this.maze.drawSolution('#ff7575', 3);
  }

  private hooray() {
    let audio = new Audio('assets/KidsCheering.mp3');
    audio.play();
  }
}

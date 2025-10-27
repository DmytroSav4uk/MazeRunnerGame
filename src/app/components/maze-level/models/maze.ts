import { Cell } from './cell';
import {IBiome} from '../../../interfaces/Biome';

/**
 * A 2-dimensional maze generated based on "hunt-and-kill" algorithm.
 */
export class Maze {
  public  cells: Array<Array<Cell>> = [];

  public currentBiome: IBiome | null = null;
  private readonly cellBackground = 'rgba(255,255,255,0)';

  setBiome(biome: IBiome) {
    this.currentBiome = biome;
  }
  /**
   * Create a maze with <nRow> × <nCol> cells.
   * @param nRow number of rows
   * @param nCol number of columns
   * @param cellSize size of each cell in pixels
   * @param ctx canvas rendering context
   * @param cellsData optional pre-made cells (for loading saved maze)
   * @param wallAssets
   */
  constructor(
    public nRow: number,
    public nCol: number,
    public cellSize: number,
    public ctx: CanvasRenderingContext2D,
    cellsData?: Array<Array<any>>, // cells from JSON
    private wallAssets?: HTMLImageElement[]
  ) {
    if (cellsData) {
      for (let i = 0; i < cellsData.length; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < cellsData[i].length; j++) {
          const c = cellsData[i][j];
          const cell = new Cell(c.row, c.col);
          cell.northWall = c.northWall;
          cell.eastWall = c.eastWall;
          cell.southWall = c.southWall;
          cell.westWall = c.westWall;
          cell.traversed = c.traversed;
          row.push(cell);
        }
        this.cells.push(row);
      }
    } else {
      // generating random maze
      for (let i = 0; i < nRow; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < nCol; j++) {
          row.push(new Cell(i, j));
        }
        this.cells.push(row);
      }

      const current = this.cells[RandomNumber.within(this.nRow)][
        RandomNumber.within(this.nCol)
        ];
      this.huntAndKill(current);
    }
  }


  draw(lineThickness = 80) {
    this.ctx.lineWidth = lineThickness;
    this.cells.forEach((row) =>
      row.forEach((c) => {
        this.drawWallDecor(c);
        c.draw(this.ctx, this.cellSize, this.cellBackground, 'rgb(241,0,0)');
      })
    );
  }

  private _wallTextureCache?: HTMLImageElement;


  drawWallDecor(cell: Cell) {
    const ctx = this.ctx;
    const size = this.cellSize;
    const x0 = cell.col * size;
    const y0 = cell.row * size;

    // Якщо є текстура стіни — малюємо її на всю довжину
    const biomeTexture = (this as any).currentBiome?.wallTexture; // отримаємо з MazeLevel через setBiome
    if (biomeTexture) {
      // === кешуємо зображення один раз ===
      if (!this._wallTextureCache) {
        this._wallTextureCache = new Image();
        this._wallTextureCache.src = biomeTexture;
      }
      const textureImg = this._wallTextureCache;

      const wallThickness = 50; // товщина стіни

      const drawTexturedWall = (x: number, y: number, w: number, h: number, angle: number = 0) => {
        if (!textureImg.complete) return; // якщо ще не завантажено
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(textureImg, 0, 0, w, h);
        ctx.restore();
      };

      if (cell.northWall) drawTexturedWall(x0, y0 - wallThickness / 2, size, wallThickness);
      if (cell.southWall) drawTexturedWall(x0, y0 + size - wallThickness / 2, size, wallThickness);
      if (cell.westWall)  drawTexturedWall(x0 - wallThickness / 2, y0, wallThickness, size);
      if (cell.eastWall)  drawTexturedWall(x0 + size - wallThickness / 2, y0, wallThickness, size);

      return; // не малюємо декор якщо є текстура
    }

    console.log('no wall texture');

    // --- Старий варіант з окремими картинками ---
    if (!this.wallAssets || this.wallAssets.length === 0) return;

    const step = size / 4;
    const count = Math.ceil(size / step);

    if (!cell.wallDecorPositions) cell.wallDecorPositions = {};

    const getWallImg = (index: number) => this.wallAssets![index % this.wallAssets!.length];

    // === нижня стіна ===
    if (cell.southWall) {
      if (!cell.wallDecorPositions.south) {
        cell.wallDecorPositions.south = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.south.push({
            img,
            dx: x0 + i * step,
            dy: y0 + size - img.height * 0.3 - 30,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.south.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }

    // === верхня стіна ===
    if (cell.northWall) {
      if (!cell.wallDecorPositions.north) {
        cell.wallDecorPositions.north = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.north.push({
            img,
            dx: x0 + i * step,
            dy: y0 - img.height * 0.7 + 60,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.north.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }

    // === ліва стіна ===
    if (cell.westWall) {
      if (!cell.wallDecorPositions.west) {
        cell.wallDecorPositions.west = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.west.push({
            img,
            dx: x0 - img.width * 0.8 + 50,
            dy: y0 + i * step - 30,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.west.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }

    // === права стіна ===
    if (cell.eastWall) {
      if (!cell.wallDecorPositions.east) {
        cell.wallDecorPositions.east = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.east.push({
            img,
            dx: x0 + size - img.width * 0.2 - 20,
            dy: y0 + i * step - 30,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.east.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }
  }

  private huntAndKill(current: Cell) {
    const unvisitedNeighbors = this.getNeighbors(current).filter((c) => !c.hasVisited());

    if (unvisitedNeighbors.length === 0) {
      // Hunt
      const randomRows = this.shuffleArray([...Array(this.nRow).keys()]);
      for (let huntRow of randomRows) {
        const randomColumns = this.shuffleArray([...Array(this.nCol).keys()]);
        for (let huntCol of randomColumns) {
          current = this.cells[huntRow][huntCol];
          if (current.hasVisited()) continue;

          const visitedNeighbors = this.getNeighbors(current).filter((c) => c.hasVisited());
          if (visitedNeighbors.length < 1) continue;

          const nextCell = visitedNeighbors[RandomNumber.within(visitedNeighbors.length)];
          current.breakWallWith(nextCell);
          this.huntAndKill(nextCell);
        }
      }
    } else {
      // Kill
      const nextCell = unvisitedNeighbors[RandomNumber.within(unvisitedNeighbors.length)];
      current.breakWallWith(nextCell);
      this.huntAndKill(nextCell);
    }
  }

  private getNeighbors(cell: Cell): Array<Cell> {
    const neighbors = [];
    if (cell.row - 1 >= 0) neighbors.push(this.cells[cell.row - 1][cell.col]);
    if (cell.row + 1 < this.nRow) neighbors.push(this.cells[cell.row + 1][cell.col]);
    if (cell.col - 1 >= 0) neighbors.push(this.cells[cell.row][cell.col - 1]);
    if (cell.col + 1 < this.nCol) neighbors.push(this.cells[cell.row][cell.col + 1]);
    return neighbors;
  }

  private shuffleArray(array: number[]): number[] {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const temp = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[temp]] = [array[temp], array[currentIndex]];
    }
    return array;
  }
}

class RandomNumber {
  static within(n: number): number {
    return Math.floor(Math.random() * n);
  }
}

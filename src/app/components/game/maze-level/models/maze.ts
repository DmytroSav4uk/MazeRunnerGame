import { Cell } from './cell';
import {IBiome} from '../../../../interfaces/Biome';


export class Maze {
  public cells: Array<Array<Cell>> = [];
  public currentBiome: IBiome | null = null;
  private readonly cellBackground = 'rgba(255,255,255,0)';

  private _wallTextureCache?: HTMLImageElement;
  private _wallTextureLoaded: boolean = false;
  private _wallTexturePromise?: Promise<void>;

  setBiome(biome: IBiome): Promise<void> | void {
    this.currentBiome = biome;

    console.log(biome?.wallTexture)

    if (biome?.wallTexture) {
      if (!this._wallTextureCache || this._wallTextureCache.src !== biome.wallTexture) {
        this._wallTextureCache = new Image();
        this._wallTextureLoaded = false;
        this._wallTexturePromise = new Promise((resolve) => {
          this._wallTextureCache!.onload = () => {
            this._wallTextureLoaded = true;
            resolve();
          };
          this._wallTextureCache!.src = biome.wallTexture!;
        });
        return this._wallTexturePromise; // 👈 ось це важливо
      }
    } else {
      this._wallTextureCache = undefined;
      this._wallTextureLoaded = false;
    }
  }



  async preloadWallAssets(): Promise<void> {
    if (!this.wallAssets) return;
    const loadPromises = this.wallAssets.map(
      img =>
        new Promise<void>(resolve => {
          if (img.complete && img.naturalWidth > 0) resolve();
          else img.onload = () => resolve();
        })
    );
    await Promise.all(loadPromises);
  }


  constructor(
    public nRow: number,
    public nCol: number,
    public cellSize: number,
    public ctx: CanvasRenderingContext2D,
    cellsData?: Array<Array<any>>,
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
      for (let i = 0; i < nRow; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < nCol; j++) {
          row.push(new Cell(i, j));
        }
        this.cells.push(row);
      }
      const current = this.cells[RandomNumber.within(this.nRow)][RandomNumber.within(this.nCol)];
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

  async drawWallDecor(cell: Cell) {

    if (this.wallAssets && this.wallAssets.some(img => img.width === 0)) return;

    const ctx = this.ctx;
    const size = this.cellSize;
    const x0 = cell.col * size;
    const y0 = cell.row * size;
    const biomeTexture = this.currentBiome?.wallTexture;

    if (biomeTexture) {

      if (this._wallTexturePromise && !this._wallTextureLoaded) {
        await this._wallTexturePromise;
      }

      const textureImg = this._wallTextureCache;
      if (!textureImg || !this._wallTextureLoaded) return;

      const wallThickness = 50;

      const drawTexturedWall = (x: number, y: number, w: number, h: number) => {
        ctx.drawImage(textureImg, x, y, w, h);
      };

      if (cell.northWall) drawTexturedWall(x0, y0 - wallThickness / 2, size, wallThickness);
      if (cell.southWall) drawTexturedWall(x0, y0 + size - wallThickness / 2, size, wallThickness);
      if (cell.westWall)  drawTexturedWall(x0 - wallThickness / 2, y0, wallThickness, size);
      if (cell.eastWall)  drawTexturedWall(x0 + size - wallThickness / 2, y0, wallThickness, size);

      return;
    }

    if (!this.wallAssets || this.wallAssets.length === 0) return;

    const step = size / 4;
    const count = Math.ceil(size / step);
    if (!cell.wallDecorPositions) cell.wallDecorPositions = {};
    const getWallImg = (index: number) => this.wallAssets![index % this.wallAssets!.length];

    // SOUTH
    if (cell.southWall) {
      if (!cell.wallDecorPositions.south) {
        cell.wallDecorPositions.south = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.south.push({
            img,
            dx: x0 + i * step,
            dy: y0 + size - img.height * 0.3 - 35,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.south.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }

    // NORTH
    if (cell.northWall) {
      if (!cell.wallDecorPositions.north) {
        cell.wallDecorPositions.north = [];
        for (let i = 0; i < count; i++) {
          const img = getWallImg(i);
          cell.wallDecorPositions.north.push({
            img,
            dx: x0 + i * step,
            dy: y0 - img.height * 0.7 + 35,
            scale: 0.7
          });
        }
      }
      cell.wallDecorPositions.north.forEach(p =>
        ctx.drawImage(p.img, p.dx, p.dy, p.img.width * p.scale, p.img.height * p.scale)
      );
    }

    // WEST
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

    // EAST
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

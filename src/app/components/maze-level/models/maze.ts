import { Cell } from './cell';

/**
 * A 2-dimensional maze generated based on "hunt-and-kill" algorithm.
 */
export class Maze {
  public  cells: Array<Array<Cell>> = [];
  private readonly cellBackground = '#FFFFFF';

  /**
   * Create a maze with <nRow> × <nCol> cells.
   * @param nRow number of rows
   * @param nCol number of columns
   * @param cellSize size of each cell in pixels
   * @param ctx canvas rendering context
   * @param cellsData optional pre-made cells (for loading saved maze)
   */
  constructor(
    public nRow: number,
    public nCol: number,
    public cellSize: number,
    public ctx: CanvasRenderingContext2D,
    cellsData?: Array<Array<any>> // cells from JSON
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


  draw(lineThickness = 2) {
    this.ctx.lineWidth = lineThickness;
    this.cells.forEach((row) =>
      row.forEach((c) => c.draw(this.ctx, this.cellSize, this.cellBackground))
    );
  }

  drawPath(
    path: Cell[],
    color = '#4080ff',
    lineThickness = 10,
    drawSolution = false
  ) {
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);

    path.forEach((x) =>
      this.ctx.lineTo((x.col + 0.5) * this.cellSize, (x.row + 0.5) * this.cellSize)
    );

    if (drawSolution) {
      this.ctx.lineTo(this.nCol * this.cellSize, (this.nRow - 0.5) * this.cellSize);
    }
    this.ctx.stroke();
  }

  erasePath(path: Cell[]) {
    this.drawPath(path, this.cellBackground);
  }

  findPath(): Array<Cell> {
    this.cells.forEach((row) => row.forEach((c) => (c.traversed = false)));
    const start = this.cells[0][0];
    const end = this.cells[this.nRow - 1][this.nCol - 1];
    const path: Array<Cell> = [];
    path.unshift(start);

    while (1) {
      let current = path[0];
      current.traversed = true;

      if (current.equals(end)) break;

      const traversableNeighbors = this.getNeighbors(current)
        .filter((c) => c.hasConnectionWith(current))
        .filter((c) => !c.traversed);

      if (traversableNeighbors.length === 0) {
        path.splice(0, 1);
      } else {
        path.unshift(traversableNeighbors[0]);
      }
    }

    return path.reverse();
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

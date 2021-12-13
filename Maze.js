import { Cell } from "./cell.js";
import { Wall } from "./Wall.js";
import { Pillar } from "./Pillar.js";

export class Maze {
  constructor(rows, columns, mask) {
    this.rows = rows;
    this.columns = columns;
    this.mask = mask;
    this.grid = this.prepare_grid();
    this.configure_cells();
  }

  getRows() {
    return this.grid;
  }

  prepare_grid() {
    const grid = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      const row = [];
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        if (this.mask.getIsOn(rowIndex, columnIndex)) {
          row.push(new Cell(rowIndex, columnIndex, this.rows, this.columns));
        } else {
          row.push(null);
        }
      }
      grid.push(row);
    }
    return grid;
  }

  get_cells() {
    const cells = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        if (this.grid[rowIndex][columnIndex]) {
          cells.push(this.grid[rowIndex][columnIndex]);
        }
      }
    }
    return cells;
  }

  getPillars(gl, ctx, width, height, thickness, wallWidth) {
    const pillars = [];
    for (let rowIndex = 0; rowIndex <= this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex <= this.columns; columnIndex++) {
        pillars.push(
          new Pillar(
            gl,
            ctx,
            width,
            height,
            thickness,
            columnIndex,
            rowIndex,
            wallWidth
          )
        );
      }
    }
    return pillars;
  }

  getWalls(gl, ctx, width, height, thickness) {
    const lookup = new Map();
    for (const cell of this.get_cells()) {
      for (const wall of cell.getWalls(gl, ctx, width, height, thickness)) {
        const key = `${wall.getCoordX()}.${wall.getCoordY()}.${
          wall.orientation
        }`;
        if (!lookup.has(key)) {
          lookup.set(key, wall);
        }
      }
    }
    return Array.from(lookup.values());
  }

  configure_cells() {
    for (const cell of this.get_cells()) {
      cell.north = this.get_cell(cell.row - 1, cell.column);
      cell.south = this.get_cell(cell.row + 1, cell.column);
      cell.west = this.get_cell(cell.row, cell.column - 1);
      cell.east = this.get_cell(cell.row, cell.column + 1);
    }
  }

  toString() {
    let output = "+" + "---+".repeat(this.columns) + "\n";
    for (const row of this.getRows()) {
      let top = "|";
      let bottom = "+";
      for (let cell of row) {
        if (!cell) {
          cell = new Cell(-1, -1);
        }
        let body = "   ";
        const east_boundary = cell.linked(cell.east) ? " " : "|";
        body += east_boundary;
        top += body;
        let south_boundary = cell.linked(cell.south) ? "   " : "---";
        let corner = "+";
        south_boundary += corner;
        bottom += south_boundary;
      }
      output += top + "\n";
      output += bottom + "\n";
    }
    return output;
  }

  toStringWithPlayer(player) {
    let output = "+" + "---+".repeat(this.columns) + "\n";
    for (const row of this.getRows()) {
      let top = "|";
      let bottom = "+";
      for (const cell of row) {
        let actual = cell;
        if (!cell) {
          actual = new Cell(-1, -1);
        }
        let body = "   ";
        if (
          player.currentCell.row === cell.row &&
          player.currentCell.column === cell.column
        ) {
          body = " " + player.getOrientationArrow() + " ";
        }
        const east_boundary = cell.linked(cell.east) ? " " : "|";
        body += east_boundary;
        top += body;
        let south_boundary = cell.linked(cell.south) ? "   " : "---";
        let corner = "+";
        south_boundary += corner;
        bottom += south_boundary;
      }
      output += top + "\n";
      output += bottom + "\n";
    }
    return output;
  }

  get_cell(row, column) {
    if (row < 0 || row >= this.rows) {
      return null;
    }
    if (column < 0 || column >= this.grid[row].length) {
      return null;
    }
    return this.grid[row][column];
  }

  start_cell() {
    return this.random_cell();
  }

  random_cell() {
    const rand_location = this.mask.random_location();
    return this.get_cell(rand_location[0], rand_location[1]);
  }

  size() {
    return this.mask.count();
  }
}

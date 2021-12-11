import { Cell } from "./cell.js";
import { Wall } from './Wall.js';

export class Maze {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
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
        row.push(new Cell(rowIndex, columnIndex, this.rows, this.columns));
      }
      grid.push(row);
    }
    return grid;
  }

  get_cells() {
    const cells = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        cells.push(this.grid[rowIndex][columnIndex]);
      }
    }
    return cells;
  }

  getWalls(gl, ctx, width, height, thickness) {
    const lookup = new Map();
    for (const cell of this.get_cells()) {
      for (const wall of cell.getWalls(gl, ctx, width, height, thickness)) {
        const key = `${wall.getCoordX()}.${wall.getCoordY()}.${wall.orientation}`;
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
      for (const cell of row) {
        let actual = cell;
        if (!cell) {
          actual = new Cell(-1, -1);
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
    return this.get_cell(this.rows - 1, 0);
  }

  random_cell() {
    row = Math.floor(Math.random() * this.rows);
    column = Math.floor(Math.random() * this.grid[row].length);
    return this.get_cell(row, column);
  }

  size() {
    return this.rows * this.columns;
  }
}

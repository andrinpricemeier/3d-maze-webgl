import { Cell } from "./Cell.js";
import { Pillar } from "./Pillar.js";
import { FloorTile } from "./FloorTile.js";

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

  getFloorTiles(gl, ctx, width, height, thickness, wallThickness, wallHeight) {
    const tiles = [];
    for (const cell of this.get_cells()) {
      tiles.push(
        new FloorTile(
          gl,
          ctx,
          width,
          height,
          thickness,
          cell.getViewColumn(),
          cell.getViewRow(),
          wallThickness,
          wallHeight
        )
      );
    }
    return tiles;
  }

  getPillars(gl, ctx, width, height, thickness, wallWidth) {
    const uniquePillarCoords = new Set();
    for (const cell of this.get_cells()) {
      uniquePillarCoords.add([cell.getViewRow(), cell.getViewColumn()]);
      uniquePillarCoords.add([cell.getViewRow(), cell.getViewColumn() + 1]);
      uniquePillarCoords.add([cell.getViewRow() + 1, cell.getViewColumn() + 1]);
      uniquePillarCoords.add([cell.getViewRow() + 1, cell.getViewColumn()]);
    }
    const pillars = [];
    for (const pillarCord of uniquePillarCoords) {
      pillars.push(
        new Pillar(
          gl,
          ctx,
          width,
          height,
          thickness,
          pillarCord[1],
          pillarCord[0],
          wallWidth
        )
      );
    }
    return pillars;
  }

  getWalls(gl, ctx, width, height, thickness, offsetZ, mustBeLinked) {
    const lookup = new Map();
    for (const cell of this.get_cells()) {
      for (const wall of cell.getWalls(
        gl,
        ctx,
        width,
        height,
        thickness,
        offsetZ,
        mustBeLinked
      )) {
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
          player.currentCell.row === actual.row &&
          player.currentCell.column === actual.column
        ) {
          body = " " + player.getOrientationArrow() + " ";
        }
        const east_boundary = actual.linked(actual.east) ? " " : "|";
        body += east_boundary;
        top += body;
        let south_boundary = actual.linked(actual.south) ? "   " : "---";
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

  end_cell(startCell) {
    while (true) {
      const endCell = this.random_cell();
      const euclidianDistance = Math.pow(endCell.wall_x - startCell.wall_x, 2) + (Math.pow(endCell.wall_y - startCell.wall_y, 2));
      const normalizedDist = euclidianDistance / this.size();
      if (startCell !== endCell && normalizedDist > 0.3) {
        return endCell;
      }
    }
  }

  random_cell() {
    const rand_location = this.mask.random_location();
    return this.get_cell(rand_location[0], rand_location[1]);
  }

  size() {
    return this.mask.count();
  }
}

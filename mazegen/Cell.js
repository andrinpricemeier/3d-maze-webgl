import { Wall } from "./Wall.js";
import { Distances } from "./Distances.js";
export class Cell {
  constructor(row, column, num_rows, num_columns) {
    this.row = row;
    this.column = column;
    this.num_rows = num_rows;
    this.num_columns = num_columns;
    this.links = new Map();
    // Nur die mit Weg sind gesetzt
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.wall_x = this.column;
    this.wall_y = this.num_rows - this.row - 1;
    this.isTrophy = false;
  }

  getViewRow() {
    return this.num_rows - this.row - 1;
  }

  getViewColumn() {
    return this.column;
  }

  distances() {
    const distances = new Distances(this);
    let frontier = [this];
    while (frontier.length > 0) {
      const new_frontier = [];
      for (const cell of frontier) {
        for (const [link, value] of cell.links.entries()) {
          if (distances.hasDistance(link)) {
            continue;
          }
          distances.setDistance(link, distances.getDistance(cell) + 1);
          new_frontier.push(link);
        }
      }
      frontier = new_frontier;
    }
    return distances;
  }

  getWalls(gl, ctx, width, height, thickness, offsetZ, mustBeLinked) {
    const walls = [];
    const wall_x = this.getViewColumn();
    const wall_y = this.getViewRow();
    if (!mustBeLinked || !this.isLinkedNorth()) {
      const wall = new Wall(
        gl,
        ctx,
        width,
        height,
        thickness,
        wall_x,
        wall_y + 1,
        "horizontal",
        offsetZ
      );
      walls.push(wall);
    }
    if (!mustBeLinked || !this.isLinkedSouth()) {
      const wall = new Wall(
        gl,
        ctx,
        width,
        height,
        thickness,
        wall_x,
        wall_y,
        "horizontal",
        offsetZ
      );
      walls.push(wall);
    }
    if (!mustBeLinked || !this.isLinkedEast()) {
      const wall = new Wall(
        gl,
        ctx,
        width,
        height,
        thickness,
        wall_x + 1,
        wall_y,
        "vertical",
        offsetZ
      );
      walls.push(wall);
    }
    if (!mustBeLinked || !this.isLinkedWest()) {
      const wall = new Wall(
        gl,
        ctx,
        width,
        height,
        thickness,
        wall_x,
        wall_y,
        "vertical",
        offsetZ
      );
      walls.push(wall);
    }
    return walls;
  }

  link(cell, bidirectional) {
    this.links.set(cell, true);
    if (bidirectional) {
      cell.link(this, false);
    }
    return this;
  }

  unlink(cell, bidirectional) {
    this.links.delete(cell);
    if (bidirectional) {
      cell.unlink(this, false);
    }
    return this;
  }

  //is linked?
  linked(cell) {
    return this.links.has(cell);
  }

  isLinkedNorth() {
    return this.linked(this.north);
  }

  isLinkedEast() {
    return this.linked(this.east);
  }

  isLinkedSouth() {
    return this.linked(this.south);
  }

  isLinkedWest() {
    return this.linked(this.west);
  }

  neighbours() {
    const list = [];
    if (this.north) {
      list.push(this.north);
    }
    if (this.south) {
      list.push(this.south);
    }
    if (this.west) {
      list.push(this.west);
    }
    if (this.east) {
      list.push(this.east);
    }
    return list;
  }
}

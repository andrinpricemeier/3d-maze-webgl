export class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.links = new Map();
    // Nur die mit Weg sind gesetzt
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
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

  neighbours() {
    list = [];
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
  }
}

export class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.links = {};
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
  }

  link(cell, bidirectional) {
    this.links[cell] = true;
    if (bidirectional) {
      cell.link(this, false);
    }
    return this;
  }

  unlink(cell, bidirectional) {
    const index = this.links.indexOf(cell);
    if (index > -1) {
      this.links.splice(index, 1);
    }
    if (bidirectional) {
      cell.unlink(this, false);
    }
    return this;
  }

  links() {
    const result = [];
    for (var cell in this.links) {
      if (Object.prototype.hasOwnProperty.call(this.links, cell)) {
        result.push(cell);
      }
    }
    return result;
  }

  linked(cell) {
    return this.links[cell] !== undefined && this.links[cell] !== null;
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

export class Distances {
  constructor(root) {
    this.root = root;
    this.cells = new Map();
    this.cells.set(this.root, 0);
  }

  getDistance(cell) {
    return this.cells.get(cell);
  }

  hasDistance(cell) {
      return this.cells.has(cell);
  }

  setDistance(cell, distance) {
    this.cells.set(cell, distance);
  }

  path_to(goal) {
    let current = goal;
    const breadcrumbs = new Distances(this.root);
    breadcrumbs.setDistance(current, this.cells.get(current));
    while (current !== this.root) {
      for (const [neighbour, v] of current.links.entries()) {
        if (this.cells.get(neighbour) < this.cells.get(current)) {
          breadcrumbs.setDistance(neighbour, this.cells.get(neighbour));
          current = neighbour;
          break;
        }
      }
    }
    return breadcrumbs;
  }
}

import { Distances } from "./Distances.js";
import { CellObject } from "../CellObject.js";
import { SolutionMarker } from "./SolutionMarker.js";

export class Solution {
  constructor(gl, ctx) {
    this.gl = gl;
    this.ctx = ctx;
    this.show = false;
    this.path = [];
  }

  solve(current, goal) {
    const distances = current.distances();
    const solution = distances.path_to(goal);
    this.path = [];
    const entries = solution.cells.entries();
    let total = 1;
    if (solution.cells.size > 0) {
      total = solution.cells.size;
    }
    let currentPart = 0;
    for (const [part, value] of entries) {
      const inCell = new CellObject(
        new SolutionMarker(this.gl, this.ctx, 3, 3, 3, currentPart/total)
      );
      inCell.setPosition(part.wall_x, part.wall_y);
      this.path.push(inCell);
      currentPart++;
    }
  }

  switchSolution() {
    this.show = !this.show;
  }

  update() {
    if (!this.show) {
      return;
    }
    for (const marker of this.path) {
      marker.update();
    }
  }

  draw(lagFix) {
    if (!this.show) {
      return;
    }
    for (const marker of this.path) {
      marker.draw(lagFix);
    }
  }
}

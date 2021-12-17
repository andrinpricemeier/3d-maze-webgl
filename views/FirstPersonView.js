import { PerspectiveProjection } from "../projections/PerspectiveProjection.js";
import { Camera } from "../Camera.js";

export class FirstPersonView {
  constructor(gl, ctx, startCell, wallWidth, wallThickness) {
    this.gl = gl;
    this.ctx = ctx;
    this.currentCell = startCell;
    this.wallWidth = wallWidth;
    this.wallThickness = wallThickness;
    this.camera = new Camera(gl, ctx.shaderProgram);
    this.projection = new PerspectiveProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    this.orientations = {
      NORTH: 0,
      EAST: 1,
      SOUTH: 2,
      WEST: 3,
    };

    this.directions = [0, 100, 100, 0, 0, -100, -100, 0];
    this.orientation = this.orientations.NORTH;
    this.rotation = {
      CLOCKWISE: 1,
      COUNTERCLOCKWISE: 2,
    };

    this.orientation = this.orientations.NORTH;
  }

  rotate(rotation) {
    if (rotation === this.rotation.CLOCKWISE) {
      this.rotateClockwise();
    } else if (rotation === this.rotation.COUNTERCLOCKWISE) {
      this.rotateCounterClockwise();
    }
  }

  update(cell) {
    this.currentCell = cell;
    var direction = this.getDirection();
    const eyeX =
      (this.currentCell.wall_x + 1) * this.wallThickness +
      this.currentCell.wall_x * this.wallWidth +
      this.wallWidth / 2;
    const eyeY =
      (this.currentCell.wall_y + 1) * this.wallThickness +
      this.currentCell.wall_y * this.wallWidth +
      this.wallWidth / 2;

    const eyeZ = -4;

    const centerX = eyeX + direction.x;
    const centerY = eyeY + direction.y;
    const centerZ = eyeZ + direction.z;

    const upX = 0;
    const upY = 0;
    const upZ = 1;
    this.camera.setCoordinates(
      eyeX,
      eyeY,
      eyeZ,
      centerX,
      centerY,
      centerZ,
      upX,
      upY,
      upZ
    );
  }

  rotateClockwise() {
    this.orientation = (this.orientation + 1) % 4;
  }

  rotateCounterClockwise() {
    this.orientation = (4 + this.orientation - 1) % 4;
  }

  getDirection() {
    return {
      x: this.directions[this.orientation * 2],
      y: this.directions[this.orientation * 2 + 1],
      z: 0,
    };
  }

  draw() {
    this.camera.draw();
    this.projection.draw();
  }
}

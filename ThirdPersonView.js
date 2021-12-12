import { OrthographicProjection } from "./OrthographicProjection.js";
import { Camera } from "./Camera.js";

export class ThirdPersonView {
  constructor(gl, ctx, startCell, wallWidth, wallThickness) {
    this.gl = gl;
    this.ctx = ctx;
    this.currentCell = startCell;
    this.wallWidth = wallWidth;
    this.wallThickness = wallThickness;
    this.camera = new Camera(gl, ctx.shaderProgram);
    this.projection = new OrthographicProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    this.projection.update(-15, 15, -15, 15, 0, 100);
  }

  update(newCell) {
      this.currentCell = newCell;
      const eyeX = (this.currentCell.wall_x + 1) * this.wallThickness + this.currentCell.wall_x * this.wallWidth + (this.wallWidth / 2);
      const eyeY = this.currentCell.wall_y * this.wallThickness + this.currentCell.wall_y * this.wallWidth;
      const eyeZ = 15;
      const centerX = (this.currentCell.wall_x + 1) * this.wallThickness + this.currentCell.wall_x * this.wallWidth + (this.wallWidth / 2);
      const centerY = (this.currentCell.wall_y + 1) * this.wallThickness + this.currentCell.wall_y * this.wallWidth + (this.wallWidth / 2);
      const centerZ = 0;
      const upX = 0;
      const upY = 0;
      const upZ = 1;
      this.camera.setCoordinates(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
  }

  draw() {
      this.camera.draw();
      this.projection.draw();
  }
}

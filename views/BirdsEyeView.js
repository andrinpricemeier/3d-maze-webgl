import { OrthographicProjection } from "../projections/OrthographicProjection.js";
import { Camera } from "../Camera.js";

export class BirdsEyeView {
  constructor(gl, ctx, floorWidth, floorHeight) {
    this.gl = gl;
    this.ctx = ctx;
    this.camera = new Camera(gl, ctx.shaderProgram);
    this.projection = new OrthographicProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    this.orientations = {
      NORTH: 0,
      EAST: 1,
      SOUTH: 2,
      WEST: 3,
    };

    this.orientation = this.orientations.NORTH;
    this.projection.update(
      -0.5 *
        (floorWidth *
          (this.gl.drawingBufferWidth / this.gl.drawingBufferHeight) -
          floorWidth),
      floorWidth * (this.gl.drawingBufferWidth / this.gl.drawingBufferHeight) -
        0.5 *
          (floorWidth *
            (this.gl.drawingBufferWidth / this.gl.drawingBufferHeight) -
            floorWidth),
      0,
      floorHeight,
      0,
      100
    );
  }
  
  rotate(rotation) {}

  update() {
    const eyeX = 0;
    const eyeY = 0;
    const eyeZ = 5;
    const centerX = 0;
    const centerY = 0;
    const centerZ = 0;
    const upX = 0;
    const upY = 1;
    const upZ = 0;
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

  draw() {
    this.camera.draw();
    this.projection.draw();
  }
}

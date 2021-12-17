import { SolidCube } from "../objects/SolidCube.js";

export class SolutionMarker {
  constructor(gl, ctx, width, height, thickness, colorFactor) {
    this.gl = gl;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.angularSpeed = (0.5 * 2 * Math.PI) / 360.0;
    this.angle = 0;
    const color = [colorFactor * 1.0, 0.0, 0.0];
    this.cube = SolidCube(
      this.gl,
      color,
      color,
      color,
      color,
      color,
      color
    );
  }

  setCoordinates(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  update() {
    this.angle += this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
  }

  draw(lagFix) {
    this.angle += lagFix * this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [this.x, this.y, this.z]);
    mat4.rotate(modelMatrix, modelMatrix, this.angle, [1, 0, 0]);
    mat4.scale(modelMatrix, modelMatrix, [
      this.width,
      this.height,
      this.thickness,
    ]);
    this.gl.uniformMatrix4fv(this.ctx.uModelMatrixId, false, modelMatrix);
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, modelMatrix);
    this.gl.uniformMatrix3fv(
      this.ctx.uModelNormalMatrixId,
      false,
      normalMatrix
    );
    this.cube.draw(
      this.gl,
      this.ctx.aVertexPositionId,
      this.ctx.aVertexColorId,
      this.ctx.aVertexTextureCoordId,
      this.ctx.aVertexNormalId
    );
  }
}

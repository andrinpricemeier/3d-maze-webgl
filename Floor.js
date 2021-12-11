import { SolidCube } from "./objects/SolidCube.js";
export class Floor {
  constructor(gl, ctx, width, height, thickness) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.gl = gl;
    this.ctx = ctx;
    this.cube = SolidCube(
      this.gl,
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
      [1.0, 1.0, 0.0],
      [0.0, 1.0, 1.0],
      [1.0, 0.0, 1.0]
    );
  }

  draw() {
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [this.width/2, this.height/2, -(this.thickness/2 + 10)]);
    mat4.scale(modelMatrix, modelMatrix, [
      this.width, this.height, this.thickness
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

import { SolidCube } from "../objects/SolidCube.js";

export class Pillar {
  constructor(gl, ctx, width, height, thickness, coord_x, coord_y, wall_width) {
    this.gl = gl;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.wall_width = wall_width;
    this.thickness = thickness;
    this.coord_x = coord_x;
    this.coord_y = coord_y;
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

  setTextureName(textureName) {
    this.textureName = textureName;
  }

  getTextureName() {
    return this.textureName;
  }  
  
  update() {
    
  }

  draw() {
    const modelMatrix = mat4.create();
    const centered_x = this.thickness/2;
    const start_x = centered_x + this.coord_x * this.thickness + this.coord_x * this.wall_width;
    const centered_y = this.width/2;
    const start_y = centered_y + this.coord_y * this.width + this.coord_y * this.wall_width;
    const centered_z = -(this.height/2);
    mat4.translate(modelMatrix, modelMatrix, [start_x, start_y, centered_z]);
    mat4.scale(modelMatrix, modelMatrix, [
      this.thickness, this.width, this.height
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

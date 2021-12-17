import { SolidCube } from "../objects/SolidCube.js";
export class FloorTile {
  constructor(gl, ctx, width, height, thickness, coord_x, coord_y, wallThickness, wallHeight) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.coord_x = coord_x;
    this.coord_y = coord_y;
    this.wallThickness = wallThickness;
    this.wallHeight = wallHeight;
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
    const centered_x = this.width/2;
    const start_x = centered_x + (this.coord_x + 1) * this.wallThickness + this.coord_x * this.width;
    const centered_y = this.width/2;
    const start_y = centered_y + (this.coord_y + 1) * this.wallThickness + this.coord_y * this.width;
    const start_z = -(this.thickness/2 + this.wallHeight);
    mat4.translate(modelMatrix, modelMatrix, [start_x, start_y, start_z]);
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

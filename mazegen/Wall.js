import { SolidCube } from "../objects/SolidCube.js";
export class Wall {
  constructor(
    gl,
    ctx,
    width,
    height,
    thickness,
    coord_x,
    coord_y,
    orientation,
    offsetZ
  ) {
    this.gl = gl;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.coord_x = coord_x;
    this.coord_y = coord_y;
    this.orientation = orientation;
    this.offsetZ = offsetZ;
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

  getCoordX() {
    return this.coord_x;
  }

  getCoordY() {
    return this.coord_y;
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
    if (this.orientation === "vertical") {
      const start_x = this.thickness / 2 + this.coord_x * this.thickness + this.coord_x * this.width;
      const start_y = this.width / 2 + (this.coord_y + 1) * this.thickness + this.coord_y * this.width;
      const start_z = -(this.height / 2 + this.offsetZ);
      mat4.translate(modelMatrix, modelMatrix, [start_x, start_y, start_z]);
      mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(90), [0, 0, 1]);
      mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90), [1, 0, 0]);
      mat4.scale(modelMatrix, modelMatrix, [
        this.width, this.height, this.thickness
      ]);
    } else {
      const start_x = this.width / 2 + (this.coord_x + 1) * this.thickness + this.coord_x * this.width;
      const start_y = this.thickness / 2 + this.coord_y * this.thickness + this.coord_y * this.width;
      const start_z = -(this.height / 2 + this.offsetZ);
      mat4.translate(modelMatrix, modelMatrix, [start_x, start_y, start_z]);
      mat4.rotate(modelMatrix, modelMatrix, glMatrix.toRadian(-90), [1, 0, 0]);
      mat4.scale(modelMatrix, modelMatrix, [
        this.width, this.height, this.thickness
      ]);
    }
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

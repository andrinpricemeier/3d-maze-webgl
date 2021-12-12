export class Camera {
  constructor(gl, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.coord_x = 0;
    this.coord_y = 0;
    this.view = {
      eye: { x: 0, y: 0, z: 0 },
      center: { x: 0, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };

    this.orientations = {
      NORTH: 0,
      EAST: 1,
      SOUTH: 2,
      WEST: 3,
    };

    this.orientation = this.orientations.NORTH;

    this.directions = [0, -100, 100, 0, 0, 100, -100, 0];
    this.direction = this.getDirection();

  }

  setPosition(x, y, z) {
    this.view.eye.x = x;
    this.view.eye.y = 0;
    this.view.eye.z = z; //500
    this.view.center.x = this.view.eye.x + this.direction.x;
    this.view.center.y = this.view.eye.y + this.direction.y;
    this.view.center.z = this.view.eye.z + this.direction.z;
    this.coord_x = x;
    this.coord_y = y;
  }

  setCoordinates(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
    this.view.eye.x = eyeX;
    this.view.eye.y = eyeY;
    this.view.eye.z = eyeZ;
    this.view.center.x = centerX;
    this.view.center.y = centerY;
    this.view.center.z = centerZ;
    this.view.up.x = upX;
    this.view.up.y = upY;
    this.view.up.z = upZ;
  }

  getDirection() {
    return {
      x: this.directions[this.orientation * 2],
      y: 0,
      z: this.directions[this.orientation * 2 + 1],
    };
  }

  rotateClockwise() {
    this.orientation = (this.orientation + 1) % 4;
    this.direction = this.getDirection();
  }

  rotateCounterClockwise() {
    this.orientation = (4 + this.orientation - 1) % 4;
    this.direction = this.getDirection();
  }

  draw() {
    const viewMatrix = mat4.create();
    //mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    mat4.lookAt(viewMatrix, [this.view.eye.x, this.view.eye.y, this.view.eye.z], [this.view.center.x, this.view.center.y, this.view.center.z], [this.view.up.x, this.view.up.y, this.view.up.z]);
    const matrixId = this.gl.getUniformLocation(this.shaderProgram, "uViewMatrix");
    this.gl.uniformMatrix4fv(matrixId, false, viewMatrix);
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, viewMatrix);
    const normalMatrixId = this.gl.getUniformLocation(
      this.shaderProgram,
      "uViewNormalMatrix"
    );
    this.gl.uniformMatrix3fv(normalMatrixId, false, normalMatrix);
  }
}

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

  draw() {
    const viewMatrix = mat4.create();
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

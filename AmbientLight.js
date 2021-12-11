export class AmbientLight {
    setup(gl, shaderProgram) {
      const id = gl.getUniformLocation(shaderProgram, "ambientLight.factor");
      gl.uniform1f(id, 1.0);
    }
  }
  
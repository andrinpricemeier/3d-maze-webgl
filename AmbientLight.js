export class AmbientLight {
  setup(gl, shaderProgram, factor) {
    const id = gl.getUniformLocation(shaderProgram, "ambientLight.factor");
    gl.uniform1f(id, factor);
  }
}

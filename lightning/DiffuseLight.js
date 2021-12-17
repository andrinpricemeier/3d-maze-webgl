export class DiffuseLight {
    setup(gl, shaderProgram, index, position, color, factor) {
        const positionId = gl.getUniformLocation(shaderProgram, `diffuseLights[${index}].position`);
      gl.uniform3fv(
        positionId,
        position
      );
        const colorId = gl.getUniformLocation(shaderProgram, `diffuseLights[${index}].color`);
      gl.uniform3fv(colorId, color);
      const factorId = gl.getUniformLocation(shaderProgram, `diffuseLights[${index}].factor`);
      gl.uniform1f(factorId, factor);
    }
  }
  
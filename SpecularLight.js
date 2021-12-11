export class SpecularLight {
    setup(gl, shaderProgram, index, position, color, factor, materialColor, shininess) {
      const positionId = gl.getUniformLocation(shaderProgram, `specularLights[${index}].position`);
      gl.uniform3fv(
        positionId,
        position
      );
      const colorId = gl.getUniformLocation(shaderProgram, `specularLights[${index}].color`);
      gl.uniform3fv(colorId, color);
      const factorId = gl.getUniformLocation(shaderProgram, `specularLights[${index}].factor`);
      gl.uniform1f(factorId, factor);
      const shininessId = gl.getUniformLocation(shaderProgram, `specularLights[${index}].shininess`);
      gl.uniform1f(shininessId, shininess);
      const materialColorId = gl.getUniformLocation(shaderProgram, `specularLights[${index}].materialColor`);
      gl.uniform3fv(materialColorId, materialColor);
    }
  }
  
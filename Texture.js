export class Texture {
  constructor(gl, shaderProgram, name, textureObj) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.name = name;
    this.textureObj = textureObj;
  }

  deactivate() {    
    const enableTexture = this.gl.getUniformLocation(
      this.shaderProgram,
      "uEnableTexture"
    );
    this.gl.uniform1i(enableTexture, 0);
  }

  activate() {
    const enableTexture = this.gl.getUniformLocation(
      this.shaderProgram,
      "uEnableTexture"
    );
    this.gl.uniform1i(enableTexture, 1);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObj);
    const samplerId = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.gl.uniform1i(samplerId, 0);
  }
}

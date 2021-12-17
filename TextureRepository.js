import { Texture } from "./Texture.js";

export class TextureRepository {
  constructor(gl, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.textureFiles = [];
    this.textures = new Map();
  }

  get(name) {
    return this.textures.get(name);
  }

  add(name, filepath) {
    this.textureFiles.push({ name: name, filepath: filepath });
  }

  initTexture(gl, image, textureObject) {
    gl.bindTexture(gl.TEXTURE_2D, textureObject);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, gl, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  loadAll(callWhenDone) {
    let imagesLoaded = 0;
    for (const textureFile of this.textureFiles) {
      const image = new Image();
      const that = this;
      image.onload = function () {
        imagesLoaded++;
        const textureObj = that.gl.createTexture();
        that.initTexture(that.gl, image, textureObj);
        const texture = new Texture(
          that.gl,
          that.shaderProgram,
          textureFile.name,
          textureObj
        );
        that.textures.set(textureFile.name, texture);
        if (that.textureFiles.length === imagesLoaded) {
          callWhenDone();
        }
      };
      image.src = textureFile.filepath;
    }
  }
}

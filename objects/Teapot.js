import { createFaceIterator } from "./face-iterator.js";

export class Teapot {  
  constructor(gl, ctx, rawObject) {
    this.rawObject = rawObject;
    this.angle = 0;
    this.xAngle = (2 * Math.PI) / 8;
    this.angularSpeed = (0.5 * 2 * Math.PI) / 360.0;
    this.zPositionOffset = -4;
    this.gl = gl;
    this.ctx = ctx;
    this.init();
  }  
  
  setCoordinates(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z+this.zPositionOffset;
  }

  setXRotation(x) {
    this.xAngle = x;
  }

  computeNormals(v, f) {
    var normals = new Float32Array(v.length);

    for (var i = 0, count = f.length; i < count; i += 3) {
      var v1 = f[i] * 3,
        v2 = f[i + 1] * 3,
        v3 = f[i + 2] * 3;
      var normal = this.getNormal(
        v[v1],
        v[v1 + 1],
        v[v1 + 2],
        v[v2],
        v[v2 + 1],
        v[v2 + 2],
        v[v3],
        v[v3 + 1],
        v[v3 + 2]
      );

      normals[v1] += normal[0];
      normals[v1 + 1] += normal[1];
      normals[v1 + 2] += normal[2];

      normals[v2] += normal[0];
      normals[v2 + 1] += normal[1];
      normals[v2 + 2] += normal[2];

      normals[v3] += normal[0];
      normals[v3 + 1] += normal[1];
      normals[v3 + 2] += normal[2];
    }
    return normals;
  }

  update() {
    this.angle += this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
  }

  getNormal(v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
    var normal = new Float32Array(3);
    var Ux = v2x - v1x,
      Uy = v2y - v1y,
      Uz = v2z - v1z,
      Vx = v3x - v1x,
      Vy = v3y - v1y,
      Vz = v3z - v1z;
    normal[0] = Uy * Vz - Uz * Vy;
    normal[1] = Uz * Vx - Ux * Vz;
    normal[2] = Ux * Vy - Uy * Vx;
    return normal;
  }

  defineVertices() {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.objectTriangleIterator.vertices),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  defineFaces() {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.objectTriangleIterator.faces),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  defineNormals() {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.computeNormals(
        this.objectTriangleIterator.vertices,
        this.objectTriangleIterator.faces
      ),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  defineColor() {
    var colors = [];
    for (var i = 0; i < this.objectTriangleIterator.vertices.length / 3; i++) {
      colors.push(0.8314);
      colors.push(0.6863);
      colors.push(0.2157);
    }
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(colors),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  init() {
    this.objectTriangleIterator = createFaceIterator(this.rawObject, null);
    this.verticeBuffer = this.defineVertices();
    this.indicesBuffer = this.defineFaces();
    this.normalsBuffer = this.defineNormals();
    this.colorBuffer = this.defineColor();
  }

  draw(lagFix) {
    this.angle += lagFix * this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [this.x, this.y, this.z]);
    mat4.rotate(modelMatrix, modelMatrix, this.xAngle, [1, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, this.angle, [0, 1, 0]);
    mat4.scale(modelMatrix, modelMatrix, [1, 1, 1]);
    this.gl.uniformMatrix4fv(this.ctx.uModelMatrixId, false, modelMatrix);

    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, modelMatrix);
    this.gl.uniformMatrix3fv(
      this.ctx.uModelNormalMatrixId,
      false,
      normalMatrix
    );

    // position
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticeBuffer);
    this.gl.vertexAttribPointer(
      this.ctx.aVertexPositionId,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);

    // color
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.vertexAttribPointer(
      this.ctx.aVertexColorId,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

    // normals
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
    this.gl.vertexAttribPointer(
      this.ctx.aVertexNormalId,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.ctx.aVertexNormalId);

    // sides
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.objectTriangleIterator.faces.length,
      this.gl.UNSIGNED_SHORT,
      0
    );

    // disable all attributes
    this.gl.disableVertexAttribArray(this.ctx.aVertexPositionId);
    this.gl.disableVertexAttribArray(this.ctx.aVertexColorId);
    this.gl.disableVertexAttribArray(this.ctx.aVertexTextureCoordId);
    this.gl.disableVertexAttribArray(this.ctx.aVertexNormalId);
  }
}

class Floor {
  constructor(width, height, thickness, vertexPositionId) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.vertexPositionId = vertexPositionId;
  }

  draw(gl) {
    var vertices = [
      0, 0, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.5, 0, 0.6, 0, 0.6, 0.3, 0.5, 0.3,
    ];
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.vertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vertexPositionId);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

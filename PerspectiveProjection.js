export class PerspectiveProjection {
    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
    }

    draw() {        
        const projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix,
            glMatrix.toRadian(100),
            this.gl.drawingBufferWidth / this.gl.drawingBufferHeight,
            0.1,
            100
        ); 
        const id = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
        this.gl.uniformMatrix4fv(id, false, projectionMatrix);
    }
}
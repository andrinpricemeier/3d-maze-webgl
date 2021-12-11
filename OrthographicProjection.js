export class OrthographicProjection {
    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
    }

    draw() {        
        const projectionMatrix = mat4.create();
        //mat4.ortho(projectionMatrix, -5, 5, -5, 5, 0, 100);
        mat4.ortho(projectionMatrix, -15, 15, -15, 15, 0, 100);
        const id = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
        this.gl.uniformMatrix4fv(id, false, projectionMatrix);
    }
}
export class OrthographicProjection {
    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
    }

    update(left, right, bottom, top, near, far) {
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.near = near;
        this.far = far;
    }

    draw() {        
        const projectionMatrix = mat4.create();
        //mat4.ortho(projectionMatrix, 0, 100, 0, 100, 0, 100);
        mat4.ortho(projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        const id = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
        this.gl.uniformMatrix4fv(id, false, projectionMatrix);
    }
}
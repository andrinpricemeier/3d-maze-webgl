/**
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 */
class SolidSphere {

    constructor(gl) {
        this.gl = gl;
        this.SPHERE_DIV = 24;
        this.verticeAndNormals = this.defineVertices();
        this.verticeBuffer = this.verticeAndNormals.vertice
        this.normalsBuffer = this.verticeAndNormals.normals
        this.edgeBuffer = this.defineEdges();
        this.colorBuffer = this.defineColor();
        this.textureBuffer = this.defineTextures();

        this.pos = { x:0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.rotation = 0;
        this.rotationAxis = { x: 0, y: 0, z: 0 };
        this.rotationSpeed = {rad: (Math.PI / 1800) / 8}; //0.025°/ms
    }

    defineVertices() {
        // define the vertices of the sphere
        var i, ai, si, ci;
        var j, aj, sj, cj;

        var vertices = [];
        var normals = [];
        for (j = 0; j <= this.SPHERE_DIV; j++) {
            aj = j * Math.PI / this.SPHERE_DIV;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for(i = 0; i <= this.SPHERE_DIV; i++) {
                ai = i * 2 * Math.PI / this.SPHERE_DIV;
                si = Math.sin(ai);
                ci = Math.cos(ai);
                var x = si * sj;
                var y = cj;
                var z = ci * sj;
                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                normals.push(x);
                normals.push(y);
                normals.push(z);
            }
        }

        var verticeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        var normalsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        return {
            vertice: verticeBuffer,
            normals: normalsBuffer
        };
    }

    defineEdges() {
        // define the edges for the cube, there are 12 edges in a cube

        var i, ai, si, ci;
        var j, aj, sj, cj;
        var p1, p2;

        var vertexIndices = [];
        for (j = 0; j <= this.SPHERE_DIV; j++) {
            for(i = 0; i <= this.SPHERE_DIV; i++) {
                p1 = j * (this.SPHERE_DIV+1) + i;
                p2 = p1 + (this.SPHERE_DIV+1);

                vertexIndices.push(p1);
                vertexIndices.push(p2);
                vertexIndices.push(p1+1);

                vertexIndices.push(p1+1);
                vertexIndices.push(p2);
                vertexIndices.push(p2+1);
            }
        }

        console.log(vertexIndices.length);

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineColor() {
        var i, ai, si, ci;
        var j, aj, sj, cj;
        var p1, p2;

        var colors = [];
        for (j = 0; j <= this.SPHERE_DIV; j++) {
            for (i = 0; i <= this.SPHERE_DIV; i++) {
                //colors.push(Math.random());
                //colors.push(Math.random());
                //colors.push(Math.random());
                colors.push(1.0);
                colors.push(0.0);
                colors.push(0.0);
            }
        }

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineTextures() {
        var textureCoord = [
            // bottom
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,

            // right
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,

            // Top
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,

            // left
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,

            // back
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,

            // front
            -1,  -1,
            0,  -1,
            -1,  0,
            0,  0,
        ];
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoord), this.gl.STATIC_DRAW);
        return buffer;
    }

    draw(ctx) {
        // position
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticeBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexPositionId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexPositionId);

        // color
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexColorId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexColorId);

        // normals
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexNormalId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexNormalId);

        // sides
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
        this.gl.uniform1i(ctx.uEnableTextureId, false);
        this.gl.drawElements(this.gl.TRIANGLES, 3750, this.gl.UNSIGNED_SHORT, 0); // SPHERE_DIV 12 = 1014,
    }

    drawWithTexture(textureObj, aVertexPositionId, aVertexTextureCoord, uSampler2DId, uEnableTexture) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticeBuffer);
        this.gl.vertexAttribPointer(aVertexPositionId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(aVertexPositionId);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(aVertexTextureCoord, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(aVertexTextureCoord);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureObj);
        this.gl.uniform1i(uSampler2DId, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);

        this.gl.uniform1i(uEnableTexture, 1);
        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }
}
/**
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 */
class SolidSphere {

    constructor(gl, longitudeBands, latitudeBands) {
        this.gl = gl;
        this.longitudeBands = longitudeBands;
        this.latitudeBands = latitudeBands;
        this.numberOfTriangles = latitudeBands*longitudeBands*2;
        this.verticeNormalsTextures = this.defineVerticesNormalsTextures();
        this.verticeBuffer = this.verticeNormalsTextures.vertice
        this.normalsBuffer = this.verticeNormalsTextures.normals
        this.textureCoordBuffer = this.verticeNormalsTextures.textures;
        this.edgeBuffer = this.defineEdges();
        this.colorBuffer = this.defineColor();

        this.pos = { x:0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.rotation = 0;
        this.rotationAxis = { x: 0, y: 0, z: 0 };
        this.rotationSpeed = {rad: (Math.PI / 1800) / 8}; //0.025°/ms
    }

    defineVerticesNormalsTextures() {
        "use strict";
        // define the vertices of the sphere
        var vertices = [];
        var normals = [];
        var textures = [];

        for (var latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / this.latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                // position (and normals as it is a unit sphere)
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                // texture coordinates
                var u = 1 - (longNumber / this.longitudeBands);
                var v = 1 - (latNumber / this.latitudeBands);

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                normals.push(x);
                normals.push(y);
                normals.push(z);

                textures.push(u);
                textures.push(v);
            }
        }

        var verticeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        var normalsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        var textureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textures), this.gl.STATIC_DRAW);


        return {
            vertice: verticeBuffer,
            normals: normalsBuffer,
            textures: textureBuffer
        };
    }

    defineEdges() {
        var vertexIndices = [];
        for (var latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
            for (var longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
                var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                var second = first + this.longitudeBands + 1;

                vertexIndices.push(first);
                vertexIndices.push(first + 1);
                vertexIndices.push(second);

                vertexIndices.push(second);
                vertexIndices.push(first + 1);
                vertexIndices.push(second + 1);
            }
        }

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineColor() {
        var i;
        var j;

        var colors = [];
        for (j = 0; j <= this.latitudeBands; j++) {
            for (i = 0; i <= this.longitudeBands; i++) {
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

    draw(ctx, textureObj) {
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

        // texture coordinates
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, this.gl.FLOAT, false, 0, 0); // !
        this.gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

        // disbale/enable textures
        if(typeof(textureObj) != "undefined") {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureObj);
            this.gl.uniform1i(ctx.uSampler2DId, 0);
            this.gl.uniform1i(ctx.uEnableTextureId, 1);
        } else {
            this.gl.uniform1i(ctx.uEnableTextureId, 0);
        }

        this.gl.drawElements(this.gl.TRIANGLES, this.numberOfTriangles*3, this.gl.UNSIGNED_SHORT, 0); // SPHERE_DIV 12 = 1014,
    }
}
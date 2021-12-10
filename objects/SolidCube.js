/**
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 */
class SolidCube {

    constructor(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        this.gl = gl;
        this.verticeBuffer = this.defineVertices();
        this.sidesBuffer = this.defineSides();
        this.colorBuffer = this.defineColors(backColor, frontColor, rightColor, leftColor, topColor, bottomColor);
        this.normalsBuffer = this.defineNormals();
        this.textureCoordBuffer = this.defineTextureCoord();
        this.pos = { x:0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.rotation = 0;
        this.rotationAxis = { x: 0, y: 0, z: 0 };
        this.rotationSpeed = {rad: (Math.PI / 1800) / 8 }; //0.025°/ms
    }

    defineVertices() {
        // define the vertices of the cube
        var vertices = [
            // back
            -0.5, -0.5, -0.5,       // v0
            0.5, -0.5, -0.5,       // v1
            0.5,  0.5, -0.5,       // v2
            -0.5,  0.5, -0.5,       // v3
            // front
            -0.5, -0.5, 0.5,        // v4
            0.5, -0.5, 0.5,        // v5
            0.5,  0.5, 0.5,        // v6
            -0.5,  0.5, 0.5,        // v7
            // right
            0.5, -0.5, -0.5,       // v8 = v1
            0.5,  0.5, -0.5,       // v9 = v2
            0.5,  0.5,  0.5,       // v10 = v6
            0.5, -0.5,  0.5,       // v11 = v5
            // left
            -0.5, -0.5, -0.5,       // v12 = v0
            -0.5,  0.5, -0.5,       // v13 = v3
            -0.5,  0.5,  0.5,       // v14 = v7
            -0.5, -0.5,  0.5,       // v15 = v4
            // top
            -0.5, 0.5, -0.5,        // v16 = v3
            -0.5, 0.5,  0.5,        // v17 = v7
            0.5, 0.5,  0.5,        // v18 = v6
            0.5, 0.5, -0.5,        // v19 = v2
            //bottom
            -0.5, -0.5, -0.5,       // v20 = v0
            -0.5, -0.5, 0.5,        // v21 = v4
            0.5, -0.5, 0.5,        // v22 = v5
            0.5, -0.5, -0.5        // v23 = v1
        ];
        var buffer  = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineSides() {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            0,2,1, // face 0 (back)
            2,0,3,
            4,5,6, // face 1 (front)
            4,6,7,
            8,9,10, // face 2 (right)
            10,11,8,
            12,15,14, // face 3 (left)
            14,13,12,
            16,17,18, // face 4 (top)
            18,19,16,
            20,23,22, // face 5 (bottom)
            22,21,20
        ];
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineColors(backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        // make 4 entries, one for each vertex
        var backSide = backColor.concat(backColor, backColor, backColor);
        var frontSide = frontColor.concat(frontColor, frontColor, frontColor);
        var rightSide = rightColor.concat(rightColor, rightColor, rightColor);
        var leftSide = leftColor.concat(leftColor, leftColor, leftColor);
        var topSide = topColor.concat(topColor, topColor, topColor);
        var bottomSide = bottomColor.concat(bottomColor, bottomColor, bottomColor);

        var allSides = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(allSides), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineTextureCoord() {
        var textureCoords = [

            // back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0


        ];
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineNormals() {
        var backNormal = [0.0, 0.0, -1.0];
        var frontNormal = [0.0, 0.0, 1.0];
        var rightNormal = [1.0, 0.0, 0.0];
        var leftNormal = [-1.0, 0.0, 0.0];
        var topNormal = [0.0, 1.0, 0.0];
        var bottomNormal = [0.0, -1.0, 0.0];

        // make 4 entries, one for each vertex
        var backSideNormal    = backNormal.concat(backNormal, backNormal, backNormal);
        var frontSideNormal   = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        var rightSideNormal   = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        var leftSideNormal    = leftNormal.concat(leftNormal, leftNormal, leftNormal);
        var topSideNormal     = topNormal.concat(topNormal, topNormal, topNormal);
        var bottomSideNormal  = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);

        var allSidesNormal = backSideNormal.concat(frontSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), this.gl.STATIC_DRAW);
        return buffer;
    }

    draw(ctx, textureObj) {
        // position
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticeBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexPositionId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexPositionId);

        // color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexColorId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexColorId);

        // normal
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
        this.gl.vertexAttribPointer(ctx.aVertexNormalId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(ctx.aVertexNormalId);

        // bind the element array
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.sidesBuffer);

        // enable lightning
        this.gl.uniform1i(ctx.uEnableLightningId, 1);

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
        this.gl.drawElements(this.gl.TRIANGLES, 36 ,this.gl.UNSIGNED_SHORT, 0);
    }
}
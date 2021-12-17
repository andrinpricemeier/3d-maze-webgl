import { createFaceIterator } from "./face-iterator.js";

export class Teapot {
    rawObject;
    objectTriangleIterator;
    verticeBuffer;
    indicesBuffer;
    constructor(gl, ctx, startCell) {


        //this.rawObject;
        this.currentCell = startCell;
        this.angle = 0;
        this.angularSpeed = (0.5 * 2 * Math.PI) / 360.0;

        this.gl = gl;
        this.ctx = ctx;

        return (async () => {
            await this.fetchTeapotAsset();
            return this; // when done
        })();

        //this.pos = { x:0, y: 0, z: 0 };
        //this.scale = { x: 1, y: 1, z: 1 };
        //this.rotation = 0;
        //this.rotationAxis = { x: 0, y: 0, z: 0 };
        //this.rotationSpeed = {rad: (Math.PI / 1800) / 8 }; //0.025°/ms
    }

    /**
     * Compute the per-vertex surface normals for the given set of vertices and faces. Vertices is the
     * same format as ARRAY_BUFFER, which x, y, z coordinates are laid out in the array next to each
     * other. Faces is a list of triangle vertex-indices, which indexes the vertices array.
     *
     * Example: computeNormals([0,0,0,1,1,1,2,2,2,3,3,3], [0,1,2,1,2,3])
     * computes the surface normals for the faces (0,0,0)(1,1,1)(2,2,2) and (1,1,1)(2,2,2)(3,3,3)
     *
     * Note: The output normals are not normalized.
     */
    computeNormals (v, f) {
        var normals = new Float32Array(v.length);

        for (var i = 0, count = f.length; i < count; i += 3) {
            var v1 = f[i] * 3, v2 = f[i+1] * 3, v3 = f[i+2] * 3;
            var normal = this.getNormal(v[v1], v[v1+1], v[v1+2], v[v2], v[v2+1], v[v2+2], v[v3], v[v3+1], v[v3+2]);

            normals[v1] += normal[0];
            normals[v1+1] += normal[1];
            normals[v1+2] += normal[2];

            normals[v2] += normal[0];
            normals[v2+1] += normal[1];
            normals[v2+2] += normal[2];

            normals[v3] += normal[0];
            normals[v3+1] += normal[1];
            normals[v3+2] += normal[2];
        }
        return normals;
    }

    /**
     * Compute surface normal of the triangle defined by v1, v2, v3 in counter clockwise direction.s
     * Reference: http://www.opengl.org/wiki/Calculating_a_Surface_Normal
     */
    getNormal(v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
        var normal = new Float32Array(3);
        var Ux = v2x - v1x, Uy = v2y - v1y, Uz = v2z - v1z,
            Vx = v3x - v1x, Vy = v3y - v1y, Vz = v3z - v1z;
        normal[0] = Uy * Vz - Uz * Vy;
        normal[1] = Uz * Vx - Ux * Vz;
        normal[2] = Ux * Vy - Uy * Vx;
        return normal;
    }

    defineVertices() {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objectTriangleIterator.vertices), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineFaces() {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.objectTriangleIterator.faces), this.gl.STATIC_DRAW);
        return buffer;
    }


    defineNormals() {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.computeNormals(this.objectTriangleIterator.vertices, this.objectTriangleIterator.faces), this.gl.STATIC_DRAW);
        return buffer;
    }

    defineColor() {
        var colors = [];

        for(var i = 0; i < this.objectTriangleIterator.vertices.length / 3; i++) {
            colors.push(0.8314);
            colors.push(0.6863);
            colors.push(0.2157);
        }
        console.log(colors);

        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        return buffer;
    }

    async fetchTeapotAsset() {
        const rawObject = await fetch("../assets/teapot_0.obj")
            .then(response => {
                if(response.status !== 200) {
                    throw new Error(response.status + " bad Request while retrieving object file");
                }
                console.log(response.status + " object file successfully fetched from server");
                return response.text()
            })
            .then(teapot => {
                return teapot;
            })
            .catch(e => {
                console.log(e);
            });

        this.rawObject = rawObject;
        this.objectTriangleIterator = createFaceIterator(this.rawObject, null)
        console.log(this.objectTriangleIterator.vertices)
        console.log(this.objectTriangleIterator.faces)
        console.log(this.objectTriangleIterator.vertices.length)
        console.log(this.objectTriangleIterator.faces.length)
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
        const new_x = 2 + (this.currentCell.wall_x + 1) * 2 + this.currentCell.wall_x * 10 + 3;
        const new_y = 2 + (this.currentCell.wall_y + 1) * 2 + this.currentCell.wall_y * 10 + 3;
        mat4.translate(modelMatrix, modelMatrix, [new_x, new_y, -5]);
        mat4.rotate(modelMatrix, modelMatrix, (2*Math.PI)/8, [1, 0, 0]);
        mat4.rotate(modelMatrix, modelMatrix, this.angle, [0, 1, 0]);
        mat4.scale(modelMatrix, modelMatrix, [ 2, 2, 2 ]);
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
        this.gl.vertexAttribPointer(this.ctx.aVertexPositionId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexPositionId);

        // color
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.ctx.aVertexColorId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexColorId);

        // normals
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
        this.gl.vertexAttribPointer(this.ctx.aVertexNormalId, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.ctx.aVertexNormalId);

        // texture coordinates
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
        //this.gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, this.gl.FLOAT, false, 0, 0); // !
        //this.gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

        // sides
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.objectTriangleIterator.faces.length, this.gl.UNSIGNED_SHORT, 0);

        // disable all attributes
        this.gl.disableVertexAttribArray(this.ctx.aVertexPositionId);
        this.gl.disableVertexAttribArray(this.ctx.aVertexColorId);
        this.gl.disableVertexAttribArray(this.ctx.aVertexTextureCoordId);
        this.gl.disableVertexAttribArray(this.ctx.aVertexNormalId);
    }
}
import {Maze} from "./maze.js";
import {MazeGenerator} from "./MazeGenerator.js";

window.onload = main;

//var main
function main() {
    var main = new Main();
}


class Main {

    gl;
    previousTimestamp;

    // objects
    wiredCube;
    solidCubeRight;

    matrices;
    camera;
    player;
    light;
    ctx;

    textures;
    colors;

    maze;
    generator;

    constructor() {
        this.matrices = {
            modelViewMat: mat4.create(),
            projectionMat:  mat4.create(),
            normalMat: mat3.create()
        };

        this.ctx = {
            shaderProgram: -1,

            aVertexPositionId: -1,
            aVertexColorId: -1,
            aVertexNormalId: -1,
            aVertexTextureCoordId: -1,

            uModelViewMatId: -1,
            uProjectionMatId: -1,
            uNormalMatId: -1,
            uEnableTextureId: -1,
            uEnableLightningId: -1,
            uLightPositionId: -1,
            uLightColorId: -1,
            uColorId: -1,

            vColorId: -1,
        };


        // lightning is im camera/eye coordinates
        // so eye is (0,0,0) for light
        this.light = {
            pos: [0, 300, -100],
            color: [1.0, 1.0, 1.0]
        }

        this.textures = {
            lenna: {}
        }

        this.colors = {
            red: [1.0, 0.0, 0.0],
            green: [0.0, 1.0, 0.0],
            blue: [0.0, 0.0, 1.0],
            cyan: [0.0, 1.0, 1.0],
            yellow: [1.0, 1.0, 0.0],
            magenta: [1.0, 0.0, 1.0],
            white: [1.0, 1.0, 1.0],
            black: [0.0, 0.0, 0.0],
        }

        this.maze = new Maze(5, 5);
        this.generator = new MazeGenerator();
        this.generator.generate(this.maze);

        this.camera = new Camera();
        this.player = new Player(this.maze.start_cell(), this.camera);
        console.log(this.maze.toString())
        this.startup();
    }

    /**
     * Startup function to be called when the body is loaded
     */
    startup() {
        "use strict";
        var canvas = document.getElementById("myCanvas");
        this.gl = createGLContext(canvas);
        this.initGL();
        loadTexture(this.gl, this.textures);
        this.draw();
    }

    /**
     * InitGL should contain the functionality that needs to be executed only once
     */
    initGL() {
        "use strict";
        // because we do not have objects which are overlapping we can use backface culling
        this.gl.frontFace(this.gl.CCW);     // defines how the front face is drawn (ccw: counter clock wise)
        this.gl.cullFace(this.gl.BACK);     // defines which face should be culled
        this.gl.enable(this.gl.CULL_FACE);  // enables culling

        // use z-Buffer because we have objects which are overlapping,
        // remeber to also clear color buffer bit with gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        //gl.enable(gl.DEPTH_TEST);

        this.ctx.shaderProgram = loadAndCompileShaders(this.gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
        this.setUpAttributesAndUniforms();
        this.setUpBuffers();

        // set background color
        this.gl.clearColor(0.8,0.8,0.8,1);

        // set orthogonal projection
        mat4.perspective(this.matrices.projectionMat, 1.8, this.gl.drawingBufferWidth/this.gl.drawingBufferHeight, 0.01, 1000)

        //mat4.ortho(this.matrices.projectionMat, -400, 400, -300, 300, 0.00001, 1000);
        this.gl.uniformMatrix4fv(this.ctx.uProjectionMatId, false, this.matrices.projectionMat);
        print4x4Mat("Orthogonal Projection:", this.matrices.projectionMat);

        // set view
        //this.camera.view.eye.y = 0;
        this.setLookAt();

        // set light
        //var light = this.matrices.modelViewMat * this.light.pos;
        //this.gl.uniform3fv(this.ctx.uLightPositionId, new Float32Array(light));
        this.gl.uniform3fv(this.ctx.uLightPositionId, new Float32Array(this.light.pos));
        this.gl.uniform3fv(this.ctx.uLightColorId, new Float32Array(this.light.color));


        // set viewport
        this.gl.viewport(0,0,800,600);

        // Register callback for animation
        window.requestAnimationFrame((timestamp) => this.drawAnimated(timestamp));
    }

    /**
     * Setup all the attribute and uniform variables
     */
    setUpAttributesAndUniforms(){
        "use strict";
        // add code here to get the ids of attributes and uniform variables from the shaders
        this.ctx.aVertexPositionId = this.gl.getAttribLocation(this.ctx.shaderProgram, "aVertexPosition");
        this.ctx.aVertexColorId = this.gl.getAttribLocation(this.ctx.shaderProgram, "aVertexColor");
        this.ctx.aVertexNormalId = this.gl.getAttribLocation(this.ctx.shaderProgram, "aVertexNormal");
        this.ctx.aVertexTextureCoordId = this.gl.getAttribLocation(this.ctx.shaderProgram, "aVertexTextureCoord");

        this.ctx.uModelViewMatId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uModelViewMat");
        this.ctx.uProjectionMatId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uProjectionMat");
        this.ctx.uNormalMatId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uNormalMat");

        this.ctx.uEnableTextureId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uEnableTexture");
        this.ctx.uEnableLightningId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uEnableLightning");
        this.ctx.uLightPositionId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uLightPosition");
        this.ctx.uLightColorId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uLightColor");
        this.ctx.uColorId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uColor");
        this.ctx.uSampler2DId = this.gl.getUniformLocation(this.ctx.shaderProgram, "uSampler");


        this.ctx.vColorId = this.gl.getUniformLocation(this.ctx.shaderProgram, "vColor");
    }

    /**
     * Setup the buffers to use.
     */
    setUpBuffers(){
        //this.wiredCube = new WireFrameCube(this.gl, [1.0, 1.0, 1.0, 0.5]);
        //this.solidCubeLeft = new SolidCube(this.gl, []);
        this.solidCubeLeft = new SolidCube(this.gl,
            this.colors.red,
            this.colors.green,
            this.colors.blue,
            this.colors.cyan,
            this.colors.yellow,
            this.colors.magenta);
        this.solidCubeLeft.scale.x = 2;
        this.solidCubeLeft.scale.y = 2;
        this.solidCubeLeft.scale.z = 2;
        this.solidCubeLeft.pos.x = -3;
        this.solidCubeLeft.pos.y = 0;
        this.solidCubeLeft.pos.z = -5;
        this.solidCubeLeft.rotationAxis.y = 1;


        this.solidSphere = new SolidSphere(this.gl);
        this.solidSphere.scale.x = 2;
        this.solidSphere.scale.y = 2;
        this.solidSphere.scale.z = 2;
        this.solidSphere.pos.x = 3;
        this.solidSphere.pos.y = 0;
        this.solidSphere.pos.z = -5;
        this.solidSphere.rotationAxis.y = 1;


    }


    drawAnimated(timeStamp) {
        // calculate time in ms since last call
        if(this.previousTimestamp == undefined) {
            this.previousTimestamp = timeStamp;
        }
        const elapsed = timeStamp - this.previousTimestamp;
        //console.log("Last Call: " + previousTimestamp + " Current Call: " + timeStamp + " Elapsed: " + elapsed);

        // move or change objects
        if(elapsed!==0) {
            //TODO: For object in objects
            //TODO:   object.updatePosition(elapsed)
            this.player.updatePosition(elapsed);
            console.log(this.maze.toStringWithPlayer(this.player));
            this.solidCubeLeft.rotation += this.solidCubeLeft.rotationSpeed.rad * elapsed;
            this.solidSphere.rotation += this.solidSphere.rotationSpeed.rad * elapsed;
        }

        this.draw();
        this.previousTimestamp = timeStamp;
        window.requestAnimationFrame((timestamp) => this.drawAnimated(timestamp));
    }
    /**
     * Draw the scene.
     */
    draw() {
        "use strict";
        //Get all objects from mazegenerator
        //Get camera position etc
        //Set view Mat
        //Draw all objects

        //console.log("Drawing");
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.setModelViewMat(this.solidCubeLeft);
        this.solidCubeLeft.draw(this.ctx);

        //this.setModelViewMat(this.solidCubeRight);
        //this.solidCubeRight.draw(this.ctx);

        this.setModelViewMat(this.solidSphere);
        this.solidSphere.draw(this.ctx);

    }

    setLookAt() {
        mat4.lookAt(this.matrices.modelViewMat,
            [this.camera.view.eye.x, this.camera.view.eye.y ,this.camera.view.eye.z],
            [this.camera.view.center.x, this.camera.view.center.y, this.camera.view.center.z],
            [this.camera.view.up.x, this.camera.view.up.y, this.camera.view.up.z]);
    }

    setModelViewMat(obj) {

        this.setLookAt();

        mat4.translate(this.matrices.modelViewMat, this.matrices.modelViewMat, [obj.pos.x, obj.pos.y, obj.pos.z]);
        mat4.rotate(this.matrices.modelViewMat, this.matrices.modelViewMat, obj.rotation, [obj.rotationAxis.x,obj.rotationAxis.y,obj.rotationAxis.z]);
        mat4.scale(this.matrices.modelViewMat, this.matrices.modelViewMat, [obj.scale.x, obj.scale.y, obj.scale.z]);

        this.gl.uniformMatrix4fv(this.ctx.uModelViewMatId, false, this.matrices.modelViewMat);

        // also set normalMat to transform normal vectors (inverse transposed of upper left 3x3 of modelViewMat)
        mat3.normalFromMat4(this.matrices.normalMat, this.matrices.modelViewMat);
        this.gl.uniformMatrix3fv(this.ctx.uNormalMatId, false, this.matrices.normalMat);

        // set light
        //var light = this.matrices.modelViewMat * this.light.pos;
        //this.gl.uniform3fv(this.ctx.uLightPositionId, new Float32Array(light));
    }


}


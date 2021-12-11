import { Maze } from "./maze.js";
import { MazeGenerator } from "./MazeGenerator.js";
import { TextureRepository } from "./TextureRepository.js";
import { Camera } from "./Camera.js";
import { Wall } from "./Wall.js";
import { Floor } from './Floor.js';
import { OrthographicProjection } from "./OrthographicProjection.js";
import { SceneLightning } from "./SceneLightning.js";

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
    this.ctx = {
      shaderProgram: -1,
      aVertexPositionId: -1,
      aVertexColorId: -1,
      aVertexNormalId: -1,
      aVertexTextureCoordId: -1,
      uModelMatrixId: -1,
      uModelNormalMatrix: -1,
    };

    this.maze = new Maze(5, 5);
    this.generator = new MazeGenerator();
    this.generator.generate(this.maze);
    console.log(this.maze.toString());

    this.startup();
  }

  startup() {
    var canvas = document.getElementById("myCanvas");
    this.gl = createGLContext(canvas);
    this.initGL();
    this.draw();
  }

  initGL() {
    this.ctx.shaderProgram = loadAndCompileShaders(
      this.gl,
      "VertexShader.glsl",
      "FragmentShader.glsl"
    );
    this.setUpAttributesAndUniforms();
    this.gl.frontFace(this.gl.CCW);
    this.gl.cullFace(this.gl.BACK);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
  }

  setUpAttributesAndUniforms() {
    this.ctx.aVertexPositionId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexPosition"
    );
    this.ctx.aVertexColorId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexColor"
    );
    this.ctx.aVertexNormalId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexNormal"
    );
    this.ctx.aVertexTextureCoordId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexTextureCoord"
    );
    this.ctx.uModelMatrixId = this.gl.getUniformLocation(
      this.ctx.shaderProgram,
      "uModelMatrix"
    );
    this.ctx.uModelNormalMatrixId = this.gl.getUniformLocation(
      this.ctx.shaderProgram,
      "uModelNormalMatrix"
    );
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const textureRepo = new TextureRepository(this.gl, this.ctx.shaderProgram);
    textureRepo.add("lena", "textures/lena512.png");
    textureRepo.add("wall", "textures/wall.png");
    textureRepo.loadAll(() => this.readyToDraw(textureRepo));
  }

  readyToDraw(repo) {
    const lights = new SceneLightning();
    lights.setup(this.gl, this.ctx.shaderProgram);
    const camera = new Camera(this.gl, this.ctx.shaderProgram);
    camera.draw();
    /*const projection = new PerspectiveProjection(
      this.gl,
      this.ctx.shaderProgram
    );*/
    const projection = new OrthographicProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    projection.draw();
    const wall = repo.get("wall");
    wall.activate();
    const NUM_Y = 5;
    const NUM_X = 5;
    const floor = new Floor(this.gl, this.ctx, NUM_X * 1 + NUM_X * 10, NUM_X * 1 + NUM_X * 10, 2);
    floor.draw();
    for (let y = 0; y < NUM_Y; y++) {
      for (let x = 0; x < NUM_X; x++) {
        const wall1 = new Wall(this.gl, this.ctx, 10, 10, 2, x, y, "horizontal");
        wall1.draw();
        const wall2 = new Wall(this.gl, this.ctx, 10, 10, 2, x, y, "vertical");
        wall2.draw();
      }
    }
  }
}
